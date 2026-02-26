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

    const fallbackMessage = "Configurazione auth non valida. Imposta NEXTAUTH_SECRET, AUTH_LOGIN_EMAIL e AUTH_LOGIN_PASSWORD.";
    const details = error instanceof Error ? error.message : fallbackMessage;

    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? fallbackMessage : `${fallbackMessage} (${details})` },
      { status: 500 },
    );
  }

  const expiresAt = sessionExpiryDate();
  const cookieValue = createSignedSessionToken(email, expiresAt.getTime());

  const cookieStore = await cookies();
  const config = getSessionCookieConfig(expiresAt);
  cookieStore.set({ ...config, value: cookieValue });

  return NextResponse.json({ ok: true });
}
