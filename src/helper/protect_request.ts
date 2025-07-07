import { NextResponse, NextRequest } from "next/server";
import { blackListController } from "@/actions/controller/blackListController";
import { RateLimitResult } from "@/types/index";
import { isDev } from "@/lib/utls";

const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 50;
const WINDOW_MS = Number(process.env.WINDOW_MS) || 60 * 1000;
const ipMap = new Map<string, { count: number; start: number }>();
const countryCache = new Map<string, string>();

async function getCountryFromIP(ip: string): Promise<string> {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "unknown") {
    return "Local";
  }

  if (countryCache.size > 500) {
    let removed = 0;
    for (const key of countryCache.keys()) {
      countryCache.delete(key);
      removed++;
      if (removed >= 250) break;
    }
  }

  if (countryCache.has(ip)) {
    return countryCache.get(ip)!;
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    const country = data.country_name || "Unknown";
    countryCache.set(ip, country);
    return country;
  } catch (error) {
    return "Unknown";
  }
}

function getIPFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

export async function checkRateLimit(
  request: NextRequest
): Promise<RateLimitResult> {
  const ip = getIPFromRequest(request);
  const now = Date.now();

  try {
    const entries = await blackListController.getByIpAsync(ip);
    if (entries.length > 0) {
      return {
        success: false,
        message: "IP is blacklisted",
      };
    }
  } catch (error) {
    if (isDev()) {
      console.warn("Error checking blacklist:", error);
    }
  }

  for (const [ipKey, value] of ipMap.entries()) {
    if (now - value.start > WINDOW_MS) {
      ipMap.delete(ipKey);
    }
  }

  const entry = ipMap.get(ip) || { count: 0, start: now };

  if (now - entry.start < WINDOW_MS) {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      try {
        const userAgent = request.headers.get("user-agent") || "Unknown";
        const country = await getCountryFromIP(ip);
        await blackListController.insert({
          ip,
          reason: "Rate limit exceeded",
          country,
          blocked_requests: entry.count,
          user_agent: userAgent,
        });
        if (isDev()) {
          console.warn(`IP ${ip} blacklisted after ${entry.count} requests`);
        }

        return {
          success: false,
          message: "Rate limit exceeded - IP blacklisted",
        };
      } catch (error) {
        return {
          success: false,
          message: "Rate limit exceeded",
        };
      }
    }
  } else {
    entry.count = 1;
    entry.start = now;
  }

  ipMap.set(ip, entry);

  return {
    success: true,
    message: `Request ${entry.count}/${RATE_LIMIT} allowed`,
  };
}

export async function protectRequest(
  request: NextRequest
): Promise<NextResponse | null> {
  const rateLimitResult = await checkRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: rateLimitResult.message },
      { status: 429 }
    );
  }
  return null;
}
