import { z } from "zod";

const mealItemSchema = z.object({
  nomePiatto: z.string().min(1),
  ingredienti: z.array(z.string().min(1)).min(1),
  istruzioni: z.string().min(1),
  tempoPreparazioneMin: z.number().int().positive(),
  varianteEmergenza: z.string().min(1),
});

export const mealsSchema = z.object({
  colazione: mealItemSchema,
  pranzo: mealItemSchema,
  cena: mealItemSchema,
  spuntini: z.array(mealItemSchema).max(2).default([]),
});

const trainingSessionSchema = z.object({
  titolo: z.string().min(1),
  riscaldamento: z.string().min(1),
  circuito: z.string().min(1),
  defaticamento: z.string().min(1),
  rpeTarget: z.number().int().min(1).max(10),
  recuperoSecondi: z.number().int().min(15).max(300),
  alternativeDolore: z.string().min(1),
});

export const sessionsSchema = z.object({
  sessions: z.array(trainingSessionSchema).min(1),
});
