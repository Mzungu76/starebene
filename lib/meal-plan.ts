import type { ProfileRecord } from "@/lib/indexeddb";

export type PantrySection = "ortofrutta" | "carne-pesce" | "dispensa" | "latticini" | "surgelati";

export type Ingredient = {
  name: string;
  quantity: string;
  section: PantrySection;
};

export type MealType = "colazione" | "pranzo" | "cena" | "spuntino1" | "spuntino2";

export type Meal = {
  id: string;
  type: MealType;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTimeMin: number;
  emergencyVariant: string;
};

export type MealPlanDay = {
  date: string;
  meals: Record<MealType, Meal>;
};

export type MealPlanWeek = {
  id: string;
  weekStartDate: string;
  createdAt: string;
  version: number;
  generatedBy: "local-rules";
  days: MealPlanDay[];
};

type MealTemplate = Omit<Meal, "id" | "type">;

const templates: Record<MealType, MealTemplate[]> = {
  colazione: [
    {
      name: "Yogurt greco con avena e banana",
      ingredients: [
        { name: "Yogurt greco", quantity: "170 g", section: "latticini" },
        { name: "Fiocchi d'avena", quantity: "40 g", section: "dispensa" },
        { name: "Banana", quantity: "1", section: "ortofrutta" },
      ],
      instructions: ["Versa lo yogurt in una ciotola.", "Aggiungi avena e banana a rondelle.", "Mescola e servi subito."],
      prepTimeMin: 5,
      emergencyVariant: "Latte + biscotti secchi + frutta fresca.",
    },
    {
      name: "Pane integrale, ricotta e miele",
      ingredients: [
        { name: "Pane integrale", quantity: "2 fette", section: "dispensa" },
        { name: "Ricotta", quantity: "80 g", section: "latticini" },
        { name: "Miele", quantity: "1 cucchiaino", section: "dispensa" },
      ],
      instructions: ["Tosta il pane 2 minuti.", "Spalma ricotta e miele.", "Completa con frutta se disponibile."],
      prepTimeMin: 6,
      emergencyVariant: "Cracker + formaggio spalmabile + una mela.",
    },
  ],
  pranzo: [
    {
      name: "Insalata di riso rapido con tonno e mais",
      ingredients: [
        { name: "Riso parboiled", quantity: "80 g", section: "dispensa" },
        { name: "Tonno al naturale", quantity: "1 scatoletta", section: "carne-pesce" },
        { name: "Mais", quantity: "80 g", section: "dispensa" },
        { name: "Pomodorini", quantity: "120 g", section: "ortofrutta" },
      ],
      instructions: ["Cuoci il riso e raffreddalo velocemente.", "Scola tonno e mais.", "Unisci tutto con pomodorini e olio evo."],
      prepTimeMin: 15,
      emergencyVariant: "Tonno + ceci in barattolo + insalata pronta.",
    },
    {
      name: "Piadina con tacchino e verdure grigliate",
      ingredients: [
        { name: "Piadina integrale", quantity: "1", section: "dispensa" },
        { name: "Fesa di tacchino", quantity: "90 g", section: "carne-pesce" },
        { name: "Zucchine grigliate", quantity: "120 g", section: "ortofrutta" },
        { name: "Stracchino", quantity: "40 g", section: "latticini" },
      ],
      instructions: ["Scalda la piadina in padella 1 minuto per lato.", "Farcisci con tacchino, verdure e stracchino.", "Piega e servi."],
      prepTimeMin: 12,
      emergencyVariant: "Panino integrale con bresaola e rucola.",
    },
  ],
  cena: [
    {
      name: "Salmone in padella con patate e insalata",
      ingredients: [
        { name: "Filetto di salmone", quantity: "150 g", section: "carne-pesce" },
        { name: "Patate", quantity: "200 g", section: "ortofrutta" },
        { name: "Insalata mista", quantity: "120 g", section: "ortofrutta" },
      ],
      instructions: ["Cuoci le patate a cubetti in microonde o acqua.", "Scottare il salmone 3-4 minuti per lato.", "Servi con insalata condita."],
      prepTimeMin: 20,
      emergencyVariant: "Uova strapazzate + pane + verdure crude.",
    },
    {
      name: "Bowl legumi, cous cous e verdure",
      ingredients: [
        { name: "Cous cous", quantity: "70 g", section: "dispensa" },
        { name: "Ceci lessati", quantity: "130 g", section: "dispensa" },
        { name: "Peperoni", quantity: "120 g", section: "ortofrutta" },
        { name: "Feta", quantity: "40 g", section: "latticini" },
      ],
      instructions: ["Reidrata il cous cous con acqua calda.", "Salta i peperoni 6-7 minuti.", "Assembla bowl con ceci e feta."],
      prepTimeMin: 18,
      emergencyVariant: "Legumi pronti + pane carasau + pomodori.",
    },
  ],
  spuntino1: [
    {
      name: "Frutta e mandorle",
      ingredients: [
        { name: "Frutta di stagione", quantity: "1 porzione", section: "ortofrutta" },
        { name: "Mandorle", quantity: "15 g", section: "dispensa" },
      ],
      instructions: ["Lava la frutta.", "Abbina con una piccola porzione di mandorle."],
      prepTimeMin: 2,
      emergencyVariant: "Barretta ai cereali + acqua.",
    },
    {
      name: "Yogurt e frutti rossi",
      ingredients: [
        { name: "Yogurt bianco", quantity: "125 g", section: "latticini" },
        { name: "Frutti rossi", quantity: "80 g", section: "surgelati" },
      ],
      instructions: ["Versa lo yogurt in una coppetta.", "Aggiungi frutti rossi scongelati."],
      prepTimeMin: 3,
      emergencyVariant: "Latte e crackers integrali.",
    },
  ],
  spuntino2: [
    {
      name: "Cracker integrali e hummus",
      ingredients: [
        { name: "Cracker integrali", quantity: "30 g", section: "dispensa" },
        { name: "Hummus", quantity: "40 g", section: "dispensa" },
      ],
      instructions: ["Disponi i cracker su un piatto.", "Servi con hummus come dip."],
      prepTimeMin: 2,
      emergencyVariant: "Frutta secca + tisana.",
    },
    {
      name: "Toast veloce prosciutto e formaggio",
      ingredients: [
        { name: "Pane in cassetta", quantity: "2 fette", section: "dispensa" },
        { name: "Prosciutto cotto", quantity: "40 g", section: "carne-pesce" },
        { name: "Formaggio", quantity: "30 g", section: "latticini" },
      ],
      instructions: ["Farcisci il toast.", "Scalda 2-3 minuti in piastra."],
      prepTimeMin: 5,
      emergencyVariant: "Yogurt da bere + banana.",
    },
  ],
};

const mealOrder: MealType[] = ["colazione", "spuntino1", "pranzo", "spuntino2", "cena"];

function chooseTemplate(type: MealType, offset: number) {
  const pool = templates[type];
  return pool[offset % pool.length];
}

function toMeal(type: MealType, date: string, slot: number, template: MealTemplate): Meal {
  return {
    ...template,
    type,
    id: `${date}-${type}-${slot}`,
  };
}

export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function weekSeed(value: string) {
  return value.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function generateMealPlanWeek(profile: ProfileRecord, weekStartDate: string): MealPlanWeek {
  const seed = weekSeed(`${weekStartDate}-${profile.obiettivo ?? "default"}`);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + index);
    const dateString = formatDateISO(date);

    const meals = mealOrder.reduce((acc, type, slot) => {
      const template = chooseTemplate(type, seed + index + slot);
      acc[type] = toMeal(type, dateString, slot, template);
      return acc;
    }, {} as Record<MealType, Meal>);

    return { date: dateString, meals } satisfies MealPlanDay;
  });

  return {
    id: `mealweek-${weekStartDate}-${Date.now()}`,
    weekStartDate,
    createdAt: new Date().toISOString(),
    version: 1,
    generatedBy: "local-rules",
    days,
  };
}

export function regenerateSingleMeal(week: MealPlanWeek, date: string, type: MealType) {
  const next = structuredClone(week);
  const day = next.days.find((item) => item.date === date);
  if (!day) return next;

  const current = day.meals[type];
  const pool = templates[type];
  const currentIndex = pool.findIndex((template) => template.name === current.name);
  const nextTemplate = pool[(currentIndex + 1 + pool.length) % pool.length];

  day.meals[type] = {
    ...nextTemplate,
    type,
    id: `${date}-${type}-${Date.now()}`,
  };

  return next;
}
