import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { blockExstansion } from "@/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (blockExstansion(pathname)) {
    return new NextResponse("Forbidden", { status: 403 });
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
  matcher: "/((?!static|.*\\..*|_next).*)",
};
