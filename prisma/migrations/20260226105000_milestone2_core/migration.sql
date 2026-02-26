-- Milestone 2 core schema
CREATE TYPE "Sesso" AS ENUM ('maschio', 'femmina', 'altro');
CREATE TYPE "Obiettivo" AS ENUM ('dimagrire', 'ricomposizione', 'mantenimento');
CREATE TYPE "LivelloAttivita" AS ENUM ('basso', 'medio', 'alto');
CREATE TYPE "LuogoAllenamento" AS ENUM ('casa', 'palestra');
CREATE TYPE "CreatedBy" AS ENUM ('ai', 'manual');
CREATE TYPE "RegenerationType" AS ENUM ('meal', 'week', 'training', 'block');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Profile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sesso" "Sesso",
  "dataNascita" TIMESTAMP(3),
  "altezzaCm" INTEGER,
  "pesoKg" DOUBLE PRECISION,
  "obiettivo" "Obiettivo",
  "livelloAttivita" "LivelloAttivita",
  "lavoroSedentario" BOOLEAN NOT NULL DEFAULT true,
  "oreSonno" DOUBLE PRECISION,
  "stress" INTEGER,
  "passiStimati" INTEGER,
  "patologieNote" TEXT,
  "farmaciNote" TEXT,
  "allergie" TEXT,
  "intolleranze" TEXT,
  "preferenzeCibo" TEXT,
  "cibiOdiati" TEXT,
  "budgetTempoCucina" TEXT,
  "attrezzaturaCucina" TEXT,
  "giorniAllenamentoPreferiti" TEXT,
  "tempoAllenamentoMin" INTEGER,
  "luogoAllenamento" "LuogoAllenamento",
  "attrezzaturaAllenamento" TEXT,
  "infortuni" TEXT,
  "note" TEXT,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CheckIn" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "pesoKg" DOUBLE PRECISION,
  "girovitaCm" DOUBLE PRECISION,
  "aderenzaDieta" INTEGER,
  "aderenzaAllenamento" INTEGER,
  "fame" INTEGER,
  "energia" INTEGER,
  "sonnoOre" DOUBLE PRECISION,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MealPlanWeek" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "weekStartDate" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "goalCalories" INTEGER,
  "notes" TEXT,
  "createdBy" "CreatedBy" NOT NULL DEFAULT 'ai',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MealPlanWeek_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MealPlanDay" (
  "id" TEXT NOT NULL,
  "weekId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "meals" JSONB NOT NULL,
  CONSTRAINT "MealPlanDay_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingPlanBlock" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdBy" "CreatedBy" NOT NULL DEFAULT 'ai',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrainingPlanBlock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingPlanWeek" (
  "id" TEXT NOT NULL,
  "blockId" TEXT NOT NULL,
  "weekNumber" INTEGER NOT NULL,
  "sessions" JSONB NOT NULL,
  CONSTRAINT "TrainingPlanWeek_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "sessionDone" BOOLEAN NOT NULL,
  "rpe" INTEGER,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RegenerationLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "RegenerationType" NOT NULL,
  "input" JSONB NOT NULL,
  "output" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RegenerationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RecoveryCode" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecoveryCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX "CheckIn_userId_date_key" ON "CheckIn"("userId", "date");
CREATE UNIQUE INDEX "MealPlanWeek_userId_weekStartDate_version_key" ON "MealPlanWeek"("userId", "weekStartDate", "version");
CREATE UNIQUE INDEX "TrainingPlanBlock_userId_startDate_version_key" ON "TrainingPlanBlock"("userId", "startDate", "version");
CREATE UNIQUE INDEX "TrainingPlanWeek_blockId_weekNumber_key" ON "TrainingPlanWeek"("blockId", "weekNumber");
CREATE UNIQUE INDEX "RecoveryCode_userId_codeHash_key" ON "RecoveryCode"("userId", "codeHash");

CREATE INDEX "CheckIn_userId_date_idx" ON "CheckIn"("userId", "date");
CREATE INDEX "MealPlanWeek_userId_weekStartDate_idx" ON "MealPlanWeek"("userId", "weekStartDate");
CREATE INDEX "MealPlanDay_date_idx" ON "MealPlanDay"("date");
CREATE INDEX "TrainingPlanBlock_userId_startDate_idx" ON "TrainingPlanBlock"("userId", "startDate");
CREATE INDEX "TrainingPlanWeek_weekNumber_idx" ON "TrainingPlanWeek"("weekNumber");
CREATE INDEX "TrainingLog_userId_date_idx" ON "TrainingLog"("userId", "date");
CREATE INDEX "RegenerationLog_userId_createdAt_idx" ON "RegenerationLog"("userId", "createdAt");
CREATE INDEX "RecoveryCode_userId_usedAt_idx" ON "RecoveryCode"("userId", "usedAt");

ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MealPlanWeek" ADD CONSTRAINT "MealPlanWeek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MealPlanDay" ADD CONSTRAINT "MealPlanDay_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "MealPlanWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingPlanBlock" ADD CONSTRAINT "TrainingPlanBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingPlanWeek" ADD CONSTRAINT "TrainingPlanWeek_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "TrainingPlanBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RegenerationLog" ADD CONSTRAINT "RegenerationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecoveryCode" ADD CONSTRAINT "RecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
