import { NextResponse, NextRequest } from "next/server";
import { blackListController } from "@/actions/controller/blackListController";
import { RateLimitResult } from "@/types/index";
import { isDev } from "@/lib/utls";

const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 50;
const WINDOW_MS = Number(process.env.WINDOW_MS) || 60 * 1000;
const MIN_REQUEST_INTERVAL_MS = 500;
const MAX_FAST_REQUESTS = 5;
const IP_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const ipMap = new Map<string, { count: number; start: number }>();
const requestHistory = new Map<string, number[]>();
const countryCache = new Map<string, string>();

function isSuspiciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const suspiciousPatterns = [
    /python-requests/i,
    /curl/i,
    /bot/i,
    /spider/i,
    /headless/i,
  ];
  return suspiciousPatterns.some((pattern) => pattern.test(userAgent));
}

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
    if (isDev()) {
      console.warn(`Error fetching country for IP ${ip}:`, error);
    }
    return "Unknown";
  }
}

function getIPFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

setInterval(() => {
  const now = Date.now();
  for (const [ipKey, value] of ipMap.entries()) {
    if (now - value.start > WINDOW_MS) {
      ipMap.delete(ipKey);
    }
  }
  for (const [ip, history] of requestHistory.entries()) {
    const recent = history.filter((timestamp) => now - timestamp < WINDOW_MS);
    if (recent.length === 0) {
      requestHistory.delete(ip);
    } else {
      requestHistory.set(ip, recent);
    }
  }
}, IP_CLEANUP_INTERVAL_MS);

export async function checkRateLimit(
  request: NextRequest
): Promise<RateLimitResult> {
  const ip = getIPFromRequest(request);
  const now = Date.now();
  const userAgent = request.headers.get("user-agent") || "Unknown";

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

  // Check for suspicious User-Agent
  if (isSuspiciousUserAgent(userAgent)) {
    try {
      //const country = await getCountryFromIP(ip);
      // await blackListController.insert({
      //   ip,
      //   reason: "Suspicious User-Agent detected",
      //   country,
      //   blocked_requests: 1,
      //   user_agent: userAgent,
      // });
      if (isDev()) {
        console.warn(
          `IP ${ip} blacklisted for suspicious User-Agent: ${userAgent}`
        );
      }
      return {
        success: false,
        message: "Suspicious client detected - IP blacklisted",
      };
    } catch (error) {
      return {
        success: false,
        message: "Suspicious client detected",
      };
    }
  }

  if (!requestHistory.has(ip)) {
    requestHistory.set(ip, []);
  }
  const history = requestHistory.get(ip)!;
  const recentRequests = history.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );
  requestHistory.set(ip, recentRequests);

  const isTooFast =
    recentRequests.length > 0 &&
    now - recentRequests[recentRequests.length - 1] < MIN_REQUEST_INTERVAL_MS;
  recentRequests.push(now);
  const fastCount = recentRequests.filter(
    (t) => now - t < MIN_REQUEST_INTERVAL_MS
  ).length;

  if (fastCount >= MAX_FAST_REQUESTS) {
    try {
      // const country = await getCountryFromIP(ip);
      // await blackListController.insert({
      //   ip,
      //   reason: "Too many rapid requests",
      //   country,
      //   blocked_requests: fastCount,
      //   user_agent: userAgent,
      // });
      if (isDev()) {
        console.warn(`IP ${ip} blacklisted for ${fastCount} rapid requests`);
      }
      return {
        success: false,
        message: "Too many rapid requests - IP blacklisted",
      };
    } catch (error) {
      return {
        success: false,
        message: "Too many rapid requests",
      };
    }
  }

  // Check rate limit
  const entry = ipMap.get(ip) || { count: 0, start: now };
  if (now - entry.start < WINDOW_MS) {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      try {
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
      {
        status: 429,
        // headers: {
        //   "Retry-After": "60",
        //   "X-Frame-Options": "DENY",
        //   "X-Content-Type-Options": "nosniff",
        //   "Content-Security-Policy": "default-src 'self'",
        // },
      }
    );
  }
  return null;
}
