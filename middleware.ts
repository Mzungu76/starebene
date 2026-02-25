import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "starebene_session";

function hasNonExpiredSession(raw: string | undefined) {
  if (!raw) return false;

  const parts = raw.split(".");
  if (parts.length < 3) return false;

  const expiresRaw = parts[parts.length - 2];
  const expiresAt = Number(expiresRaw);
  if (!expiresAt) return false;

  return Date.now() <= expiresAt;
}

export function middleware(request: NextRequest) {
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  const isValid = hasNonExpiredSession(sessionValue);

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
