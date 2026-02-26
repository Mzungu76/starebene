"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatDateISO,
  generateMealPlanWeek,
  getWeekStart,
  regenerateSingleMeal,
  type Ingredient,
  type Meal,
  type MealType,
  type PantrySection,
} from "@/lib/meal-plan";
import { getMealPlanWeek, getProfile, isProfileComplete, saveMealPlanWeek } from "@/lib/indexeddb";

const mealTypeLabel: Record<MealType, string> = {
  colazione: "Colazione",
  spuntino1: "Spuntino 1",
  pranzo: "Pranzo",
  spuntino2: "Spuntino 2",
  cena: "Cena",
};

const sectionLabel: Record<PantrySection, string> = {
  ortofrutta: "Ortofrutta",
  "carne-pesce": "Carne/Pesce",
  dispensa: "Dispensa",
  latticini: "Latticini",
  surgelati: "Surgelati",
};

const dayLabel = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function formatItalianDate(date: string, index: number) {
  const [year, month, day] = date.split("-");
  return `${dayLabel[index]} ${day}/${month}/${year}`;
}

function ShoppingList({ ingredients }: { ingredients: Ingredient[] }) {
  const grouped = useMemo(() => {
    return ingredients.reduce(
      (acc, ingredient) => {
        acc[ingredient.section].set(ingredient.name, [...(acc[ingredient.section].get(ingredient.name) ?? []), ingredient.quantity]);
        return acc;
      },
      {
        ortofrutta: new Map<string, string[]>(),
        "carne-pesce": new Map<string, string[]>(),
        dispensa: new Map<string, string[]>(),
        latticini: new Map<string, string[]>(),
        surgelati: new Map<string, string[]>(),
      } satisfies Record<PantrySection, Map<string, string[]>>,
    );
  }, [ingredients]);

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Lista spesa automatica</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(grouped).map(([section, itemMap]) => (
          <div key={section} className="rounded-lg border border-input bg-background/30 p-3">
            <h3 className="text-sm font-medium">{sectionLabel[section as PantrySection]}</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {[...itemMap.entries()].map(([name, quantities]) => (
                <li key={name}>• {name}: {quantities.join(" + ")}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MealCard({ meal, onReplace }: { meal: Meal; onReplace: () => void }) {
  return (
    <div className="rounded-lg border border-input bg-background/30 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium">{mealTypeLabel[meal.type]} · {meal.name}</h4>
        <Button variant="outline" className="h-8 px-2 text-xs" onClick={onReplace}>
          Sostituisci pasto
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">Tempo: {meal.prepTimeMin} min</p>
      <p className="mt-1 text-xs text-muted-foreground">Ingredienti: {meal.ingredients.map((item) => `${item.name} (${item.quantity})`).join(", ")}</p>
      <p className="mt-1 text-xs text-muted-foreground">Istruzioni: {meal.instructions.join(" ")}</p>
      <p className="mt-1 text-xs text-muted-foreground">Emergenza: {meal.emergencyVariant}</p>
    </div>
  );
}

export default function PlanPage() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [weekStart, setWeekStart] = useState(formatDateISO(getWeekStart()));
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [weekPlan, setWeekPlan] = useState<Awaited<ReturnType<typeof getMealPlanWeek>>>(null);

  useEffect(() => {
    let mounted = true;

    getProfile().then((profile) => {
      if (!mounted) return;
      setReady(isProfileComplete(profile));
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    getMealPlanWeek(weekStart).then((plan) => setWeekPlan(plan));
  }, [ready, weekStart]);

  async function onGenerateWeek() {
    const profile = await getProfile();
    if (!profile || !isProfileComplete(profile)) {
      setStatus("Profilo incompleto: completa il check-in prima di generare.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const generated = generateMealPlanWeek(profile, weekStart);
      await saveMealPlanWeek(generated);
      setWeekPlan(generated);
      setStatus("Settimana generata correttamente.");
    } finally {
      setLoading(false);
    }
  }

  async function onRegenerateMeal(date: string, type: MealType) {
    if (!weekPlan) return;
    const updated = regenerateSingleMeal(weekPlan, date, type);
    await saveMealPlanWeek(updated);
    setWeekPlan(updated);
    setStatus(`Rigenerato ${mealTypeLabel[type]} del ${date}.`);
  }

  const allIngredients = useMemo(() => {
    if (!weekPlan) return [];
    return weekPlan.days.flatMap((day) => Object.values(day.meals).flatMap((meal) => meal.ingredients));
  }, [weekPlan]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Piano</h1>
      <Card className="space-y-3">
        {ready === null ? <p className="text-sm text-muted-foreground">Controllo profilo in corso...</p> : null}
        {ready === false ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Completa prima il check-in: senza profilo completo l&apos;app non genera piani.
            </p>
            <Link href="/app/check-in">
              <Button>Completa check-in</Button>
            </Link>
          </div>
        ) : null}

        {ready === true ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="text-sm text-muted-foreground">
                Inizio settimana
                <input
                  type="date"
                  className="ml-2 h-10 rounded-lg border border-input bg-background/30 px-2"
                  value={weekStart}
                  onChange={(event) => setWeekStart(event.target.value)}
                />
              </label>
              <Button onClick={onGenerateWeek} disabled={loading}>
                {loading ? "Generazione..." : "Genera settimana"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Piano settimanale locale con regole rapide: ingredienti reperibili, pasti veloci e varianti emergenza.
            </p>
          </>
        ) : null}
      </Card>

      {status ? <p className="text-xs text-emerald-400">{status}</p> : null}

      {weekPlan ? (
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Settimana {weekPlan.weekStartDate}</h2>
          <div className="space-y-3">
            {weekPlan.days.map((day, index) => (
              <div key={day.date} className="space-y-2 rounded-xl border border-input p-3">
                <h3 className="text-sm font-semibold">{formatItalianDate(day.date, index)}</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {Object.entries(day.meals).map(([type, meal]) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onReplace={() => onRegenerateMeal(day.date, type as MealType)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {allIngredients.length > 0 ? <ShoppingList ingredients={allIngredients} /> : null}
    </div>
  );
}
