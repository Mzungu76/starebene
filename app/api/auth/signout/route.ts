import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSessionCookieConfig } from "@/lib/session";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const expired = getSessionCookieConfig(new Date(0));
  cookieStore.set({ ...expired, value: "" });

  return NextResponse.redirect(new URL("/", request.url));
}
