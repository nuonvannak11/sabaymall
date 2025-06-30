import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

// 1. File block extensions
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

const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
const ipMap = new Map<string, { count: number; start: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const now = Date.now();

  if (BLOCKED_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (pathname === "/middleware-example") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/api")) {
    const allowedIp = "123.123.123.123"; // adjust this
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (!["127.0.0.1", "::1", allowedIp].includes(ip)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    for (const entry of ipMap.entries()) {
      const ipKey = entry[0];
      const value = entry[1];
      if (now - value.start > WINDOW_MS) ipMap.delete(ipKey);
    }

    const entry = ipMap.get(ip) || { count: 0, start: now };

    if (now - entry.start < WINDOW_MS) {
      entry.count++;
      if (entry.count > RATE_LIMIT) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    } else {
      entry.count = 1;
      entry.start = now;
    }

    ipMap.set(ip, entry);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  const lang = (await cookies()).get("lang")?.value || "kh";
  const match = pathname.match(/^\/(en|kh)(\/|$)/);
  const locale = match ? match[1] : lang;

  if (!/^\/(en|kh)(\/|$)/.test(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
