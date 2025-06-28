import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// List of dangerous extensions to block
const BLOCKED_EXTENSIONS = [
  ".exe",
  ".sh",
  ".php",
  ".bat",
  ".cmd",
  ".ssh",
  ".scr",
  ".ps1",
  ".jar",
  ".py",
  ".pl",
  ".rb",
];

// Simple in-memory rate limiter
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
const ipMap = new Map<string, { count: number; start: number }>();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const now = Date.now();

  // Block dangerous file extensions
  if (BLOCKED_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (pathname.startsWith("/api")) {
    const allowedIp = "123.123.123.123";
    const ip =
      request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
    if (ip !== allowedIp && ip !== "127.0.0.1" && ip !== "::1") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // --- Clean up old IP entries ---
    for (const [ip, entry] of Array.from(ipMap.entries())) {
      if (now - entry.start > WINDOW_MS) {
        ipMap.delete(ip);
      }
    }

    // --- Rate limiting ---
    const entry = ipMap.get(ip) || { count: 0, start: now };
    if (now - entry.start < WINDOW_MS) {
      entry.count += 1;
      if (entry.count > RATE_LIMIT) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    } else {
      entry.count = 1;
      entry.start = now;
    }
    ipMap.set(ip, entry);
  }
  
  // Skip Next.js internals, API routes, and all files in public (by extension)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  const lang = cookies().get("lang")?.value || "kh"; // Default to 'kh' if no cookie

  // Extract locale from the path
  const match = pathname.match(/^\/(en|kh)(\/|$)/);
  const locale = match ? match[1] : lang;

  // If path does not start with /en or /kh, redirect to /en
  if (!/^\/(en|kh)(\/|$)/.test(pathname)) {
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
  return NextResponse.next();
}
