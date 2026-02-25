import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { validateCredentials } from "@/lib/auth";
import { createSignedSessionToken, getSessionCookieConfig, sessionExpiryDate } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email e password sono obbligatorie" }, { status: 400 });
  }

  try {
    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Configurazione auth non valida" }, { status: 500 });
  }

  const expiresAt = sessionExpiryDate();
  const cookieValue = createSignedSessionToken(email, expiresAt.getTime());

  const cookieStore = await cookies();
  const config = getSessionCookieConfig(expiresAt);
  cookieStore.set({ ...config, value: cookieValue });

  return NextResponse.json({ ok: true });
}
