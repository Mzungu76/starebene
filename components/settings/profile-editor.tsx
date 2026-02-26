"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, saveProfile, type ProfileRecord } from "@/lib/indexeddb";

type EditableProfile = Omit<ProfileRecord, "updatedAt">;

const initialProfile: EditableProfile = {
  sesso: "maschio",
  dataNascita: "",
  altezzaCm: undefined,
  pesoKg: undefined,
  obiettivo: "dimagrire",
  livelloAttivita: "basso",
  tempoAllenamentoMin: undefined,
  luogoAllenamento: "casa",
  note: "",
};

export function ProfileEditor() {
  const [profile, setProfile] = useState<EditableProfile>(initialProfile);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((value) => {
      if (!value) return;
      const { updatedAt, ...rest } = value;
      void updatedAt;
      setProfile((prev) => ({ ...prev, ...rest }));
    });
  }, []);

  async function onSave() {
    await saveProfile(profile);
    setSaved("Profilo aggiornato.");
    setTimeout(() => setSaved(null), 1800);
  }

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Profilo (modifica rapida)</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="h-10 rounded-lg border border-input bg-background/30 px-3" type="date" value={profile.dataNascita ?? ""} onChange={(e) => setProfile((p) => ({ ...p, dataNascita: e.target.value }))} />
        <input className="h-10 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Altezza cm" value={profile.altezzaCm ?? ""} onChange={(e) => setProfile((p) => ({ ...p, altezzaCm: Number(e.target.value) || undefined }))} />
        <input className="h-10 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Peso kg" value={profile.pesoKg ?? ""} onChange={(e) => setProfile((p) => ({ ...p, pesoKg: Number(e.target.value) || undefined }))} />
        <input className="h-10 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Tempo allenamento min" value={profile.tempoAllenamentoMin ?? ""} onChange={(e) => setProfile((p) => ({ ...p, tempoAllenamentoMin: Number(e.target.value) || undefined }))} />
      </div>
      <Button onClick={onSave}>Salva profilo</Button>
      {saved ? <p className="text-xs text-emerald-400">{saved}</p> : null}
    </Card>
  );
}
