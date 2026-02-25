import crypto from "crypto";

const SESSION_COOKIE = "starebene_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function sign(value: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required");
  }
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createSignedSessionToken(email: string, expiresAt: number) {
  const payload = `${email.toLowerCase()}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySignedSessionToken(raw: string | undefined) {
  if (!raw) return null;
  const [email, expiresRaw, signature] = raw.split(".");
  if (!email || !expiresRaw || !signature) return null;
  const payload = `${email}.${expiresRaw}`;
  if (sign(payload) !== signature) return null;
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || Date.now() > expiresAt) return null;
  return { email, expiresAt };
}

export function getSessionCookieConfig(expiresAt: Date) {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    },
  };
}

export function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_TTL_MS);
}

export { SESSION_COOKIE };
