import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@starebene.local";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Utente Demo",
    },
  });

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      sesso: "maschio",
      altezzaCm: 178,
      pesoKg: 84,
      obiettivo: "dimagrire",
      livelloAttivita: "basso",
      lavoroSedentario: true,
      oreSonno: 6.5,
      stress: 3,
      passiStimati: 5500,
      note: "Profilo seed demo",
    },
  });

  console.log("Seed completato", { userId: user.id, email: user.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
