import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySignedSessionToken } from "@/lib/session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get(SESSION_COOKIE)?.value;
  const parsed = verifySignedSessionToken(sessionRaw);

  if (!parsed) {
    return null;
  }

  return prisma.user.upsert({
    where: { email: parsed.email },
    update: {},
    create: { email: parsed.email },
  });
}
