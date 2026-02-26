import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: Number.isNaN(limit) ? 20 : Math.min(limit, 100),
  });

  return NextResponse.json({ checkIns });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    date?: string;
    pesoKg?: number;
    girovitaCm?: number;
    aderenzaDieta?: number;
    aderenzaAllenamento?: number;
    fame?: number;
    energia?: number;
    sonnoOre?: number;
    note?: string;
  };

  if (!payload.date) {
    return NextResponse.json({ error: "date obbligatoria" }, { status: 400 });
  }

  const date = new Date(payload.date);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "date non valida" }, { status: 400 });
  }

  const checkIn = await prisma.checkIn.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date,
      },
    },
    create: {
      userId: user.id,
      date,
      pesoKg: payload.pesoKg,
      girovitaCm: payload.girovitaCm,
      aderenzaDieta: payload.aderenzaDieta,
      aderenzaAllenamento: payload.aderenzaAllenamento,
      fame: payload.fame,
      energia: payload.energia,
      sonnoOre: payload.sonnoOre,
      note: payload.note,
    },
    update: {
      pesoKg: payload.pesoKg,
      girovitaCm: payload.girovitaCm,
      aderenzaDieta: payload.aderenzaDieta,
      aderenzaAllenamento: payload.aderenzaAllenamento,
      fame: payload.fame,
      energia: payload.energia,
      sonnoOre: payload.sonnoOre,
      note: payload.note,
    },
  });

  return NextResponse.json({ checkIn });
}
