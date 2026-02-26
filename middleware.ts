import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "starebene_session";

function hasNonExpiredSession(raw: string | undefined) {
  if (!raw) return false;

  const lastDot = raw.lastIndexOf(".");
  if (lastDot <= 0) return false;

  const secondLastDot = raw.lastIndexOf(".", lastDot - 1);
  if (secondLastDot <= 0) return false;

  const expiresRaw = raw.slice(secondLastDot + 1, lastDot);
  const expiresAt = Number(expiresRaw);

  if (!Number.isFinite(expiresAt) || expiresAt <= 0) return false;

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
