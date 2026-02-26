"use client";

import type { MealPlanWeek } from "@/lib/meal-plan";

export type ProfileRecord = {
  id?: number;
  sesso?: "maschio" | "femmina" | "altro";
  dataNascita?: string;
  altezzaCm?: number;
  pesoKg?: number;
  obiettivo?: "dimagrire" | "ricomposizione" | "mantenimento";
  livelloAttivita?: "basso" | "medio" | "alto";
  lavoroSedentario?: boolean;
  oreSonno?: number;
  stress?: number;
  passiStimati?: number;
  allergie?: string;
  intolleranze?: string;
  preferenzeCibo?: string;
  cibiOdiati?: string;
  budgetTempoCucina?: string;
  attrezzaturaCucina?: string;
  routineLavoroNote?: string;
  giorniAllenamentoPreferiti?: string;
  tempoAllenamentoMin?: number;
  luogoAllenamento?: "casa" | "palestra";
  attrezzaturaAllenamento?: string;
  infortuni?: string;
  note?: string;
  updatedAt: string;
};

export type CheckInRecord = {
  id?: number;
  date: string;
  pesoKg?: number;
  girovitaCm?: number;
  aderenzaDieta?: number;
  aderenzaAllenamento?: number;
  fame?: number;
  energia?: number;
  sonnoOre?: number;
  note?: string;
};

export type AppBackup = {
  version: 2;
  exportedAt: string;
  profile: ProfileRecord[];
  checkIns: CheckInRecord[];
  mealPlanWeeks: MealPlanWeek[];
};

export type LegacyAppBackup = {
  version: 1;
  exportedAt: string;
  profile: ProfileRecord[];
  checkIns: CheckInRecord[];
};

const DB_NAME = "starebene-local-db";
const DB_VERSION = 2;
const PROFILE_STORE = "profile";
const CHECKIN_STORE = "checkins";
const MEAL_PLAN_STORE = "mealplanweeks";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PROFILE_STORE)) {
        db.createObjectStore(PROFILE_STORE, { keyPath: "id", autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(CHECKIN_STORE)) {
        db.createObjectStore(CHECKIN_STORE, { keyPath: "id", autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(MEAL_PLAN_STORE)) {
        db.createObjectStore(MEAL_PLAN_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txComplete(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function getAll<T>(storeName: string) {
  const db = await openDb();

  return new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as T[]) ?? []);
    request.onerror = () => reject(request.error);
  });
}

export async function getProfile() {
  const profiles = await getAll<ProfileRecord>(PROFILE_STORE);
  return profiles.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0] ?? null;
}

export async function saveProfile(input: Omit<ProfileRecord, "updatedAt">) {
  const db = await openDb();
  const tx = db.transaction(PROFILE_STORE, "readwrite");
  const store = tx.objectStore(PROFILE_STORE);
  store.put({ ...input, id: 1, updatedAt: new Date().toISOString() } as ProfileRecord);
  await txComplete(tx);
}

export function isProfileComplete(profile: ProfileRecord | null) {
  if (!profile) return false;

  return Boolean(
    profile.sesso &&
      profile.dataNascita &&
      profile.altezzaCm &&
      profile.pesoKg &&
      profile.obiettivo &&
      profile.livelloAttivita &&
      profile.tempoAllenamentoMin &&
      profile.luogoAllenamento,
  );
}

export async function getMealPlanWeek(weekStartDate: string) {
  const allPlans = await getAll<MealPlanWeek>(MEAL_PLAN_STORE);
  return allPlans.find((plan) => plan.weekStartDate === weekStartDate) ?? null;
}

export async function saveMealPlanWeek(week: MealPlanWeek) {
  const db = await openDb();
  const tx = db.transaction(MEAL_PLAN_STORE, "readwrite");
  tx.objectStore(MEAL_PLAN_STORE).put(week);
  await txComplete(tx);
}

export async function exportBackup(): Promise<AppBackup> {
  const [profile, checkIns, mealPlanWeeks] = await Promise.all([
    getAll<ProfileRecord>(PROFILE_STORE),
    getAll<CheckInRecord>(CHECKIN_STORE),
    getAll<MealPlanWeek>(MEAL_PLAN_STORE),
  ]);

  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    profile,
    checkIns,
    mealPlanWeeks,
  };
}

export async function importBackup(backup: AppBackup | LegacyAppBackup) {
  const db = await openDb();
  const tx = db.transaction([PROFILE_STORE, CHECKIN_STORE, MEAL_PLAN_STORE], "readwrite");

  const profileStore = tx.objectStore(PROFILE_STORE);
  const checkInStore = tx.objectStore(CHECKIN_STORE);
  const mealPlanStore = tx.objectStore(MEAL_PLAN_STORE);

  profileStore.clear();
  checkInStore.clear();
  mealPlanStore.clear();

  backup.profile.forEach((item) => {
    profileStore.put(item);
  });

  backup.checkIns.forEach((item) => {
    checkInStore.put(item);
  });

  if (backup.version === 2) {
    backup.mealPlanWeeks.forEach((item) => {
      mealPlanStore.put(item);
    });
  }

  await txComplete(tx);
}
