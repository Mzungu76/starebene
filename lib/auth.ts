import { timingSafeEqual } from "crypto";

function safeEquals(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

export function validateCredentials(email: string, password: string) {
  const allowedEmail = process.env.AUTH_LOGIN_EMAIL;
  const allowedPassword = process.env.AUTH_LOGIN_PASSWORD;

  if (!allowedEmail || !allowedPassword) {
    throw new Error("AUTH_LOGIN_EMAIL and AUTH_LOGIN_PASSWORD must be configured");
  }

  const normalizedEmail = email.trim().toLowerCase();
  return safeEquals(normalizedEmail, allowedEmail.trim().toLowerCase()) && safeEquals(password, allowedPassword);
}
