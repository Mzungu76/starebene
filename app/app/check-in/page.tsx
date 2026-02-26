"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, saveProfile, type ProfileRecord } from "@/lib/indexeddb";

const TOTAL_STEPS = 8;

const defaultProfile: Omit<ProfileRecord, "updatedAt"> = {
  sesso: "maschio",
  dataNascita: "",
  altezzaCm: undefined,
  pesoKg: undefined,
  obiettivo: "dimagrire",
  livelloAttivita: "basso",
  lavoroSedentario: true,
  oreSonno: undefined,
  stress: undefined,
  passiStimati: undefined,
  allergie: "",
  intolleranze: "",
  preferenzeCibo: "",
  cibiOdiati: "",
  budgetTempoCucina: "",
  attrezzaturaCucina: "",
  routineLavoroNote: "",
  giorniAllenamentoPreferiti: "",
  tempoAllenamentoMin: undefined,
  luogoAllenamento: "casa",
  attrezzaturaAllenamento: "",
  infortuni: "",
  note: "",
};

export default function CheckInPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [profile, setProfile] = useState<Omit<ProfileRecord, "updatedAt">>(defaultProfile);

  useEffect(() => {
    let mounted = true;
    getProfile().then((existing) => {
      if (!mounted || !existing) return;
      const { updatedAt, ...payload } = existing;
      void updatedAt;
      setProfile((prev) => ({ ...prev, ...payload }));
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await saveProfile(profile);
      setStatus("Salvataggio automatico completato.");
    }, 300);

    return () => clearTimeout(timer);
  }, [profile]);

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  function update<K extends keyof Omit<ProfileRecord, "updatedAt">>(key: K, value: Omit<ProfileRecord, "updatedAt">[K]) {
    setStatus(null);
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check-in Wizard</h1>
      <Card className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {step}/{TOTAL_STEPS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="h-11 rounded-lg border border-input bg-background/30 px-3" value={profile.sesso} onChange={(e) => update("sesso", e.target.value as ProfileRecord["sesso"])}>
              <option value="maschio">Maschio</option>
              <option value="femmina">Femmina</option>
              <option value="altro">Altro</option>
            </select>
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="date" value={profile.dataNascita ?? ""} onChange={(e) => update("dataNascita", e.target.value)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Altezza (cm)" value={profile.altezzaCm ?? ""} onChange={(e) => update("altezzaCm", Number(e.target.value) || undefined)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Peso (kg)" value={profile.pesoKg ?? ""} onChange={(e) => update("pesoKg", Number(e.target.value) || undefined)} />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3">
            <select className="h-11 rounded-lg border border-input bg-background/30 px-3" value={profile.obiettivo} onChange={(e) => update("obiettivo", e.target.value as ProfileRecord["obiettivo"])}>
              <option value="dimagrire">Dimagrire</option>
              <option value="ricomposizione">Ricomposizione</option>
              <option value="mantenimento">Mantenimento</option>
            </select>
            <select className="h-11 rounded-lg border border-input bg-background/30 px-3" value={profile.livelloAttivita} onChange={(e) => update("livelloAttivita", e.target.value as ProfileRecord["livelloAttivita"])}>
              <option value="basso">Attività bassa</option>
              <option value="medio">Attività media</option>
              <option value="alto">Attività alta</option>
            </select>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-3">
            <textarea className="min-h-20 rounded-lg border border-input bg-background/30 px-3 py-2" placeholder="Allergie" value={profile.allergie ?? ""} onChange={(e) => update("allergie", e.target.value)} />
            <textarea className="min-h-20 rounded-lg border border-input bg-background/30 px-3 py-2" placeholder="Intolleranze" value={profile.intolleranze ?? ""} onChange={(e) => update("intolleranze", e.target.value)} />
            <textarea className="min-h-20 rounded-lg border border-input bg-background/30 px-3 py-2" placeholder="Preferenze / cibi da evitare" value={`${profile.preferenzeCibo ?? ""}${profile.cibiOdiati ? `\n${profile.cibiOdiati}` : ""}`} onChange={(e) => {
              const [pref, ...rest] = e.target.value.split("\n");
              update("preferenzeCibo", pref);
              update("cibiOdiati", rest.join("\n"));
            }} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" placeholder="Tempo max cucina (es. 20 min)" value={profile.budgetTempoCucina ?? ""} onChange={(e) => update("budgetTempoCucina", e.target.value)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" placeholder="Attrezzatura cucina" value={profile.attrezzaturaCucina ?? ""} onChange={(e) => update("attrezzaturaCucina", e.target.value)} />
          </div>
        ) : null}

        {step === 5 ? (
          <textarea className="min-h-24 rounded-lg border border-input bg-background/30 px-3 py-2" placeholder="Routine lavoro, orari pasti possibili, fame serale, note" value={profile.routineLavoroNote ?? ""} onChange={(e) => update("routineLavoroNote", e.target.value)} />
        ) : null}

        {step === 6 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" placeholder="Giorni allenamento preferiti" value={profile.giorniAllenamentoPreferiti ?? ""} onChange={(e) => update("giorniAllenamentoPreferiti", e.target.value)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Tempo allenamento (min)" value={profile.tempoAllenamentoMin ?? ""} onChange={(e) => update("tempoAllenamentoMin", Number(e.target.value) || undefined)} />
            <select className="h-11 rounded-lg border border-input bg-background/30 px-3" value={profile.luogoAllenamento} onChange={(e) => update("luogoAllenamento", e.target.value as ProfileRecord["luogoAllenamento"])}>
              <option value="casa">Casa</option>
              <option value="palestra">Palestra</option>
            </select>
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" placeholder="Attrezzatura allenamento" value={profile.attrezzaturaAllenamento ?? ""} onChange={(e) => update("attrezzaturaAllenamento", e.target.value)} />
          </div>
        ) : null}

        {step === 7 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Ore sonno medie" value={profile.oreSonno ?? ""} onChange={(e) => update("oreSonno", Number(e.target.value) || undefined)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" min={1} max={5} placeholder="Stress 1-5" value={profile.stress ?? ""} onChange={(e) => update("stress", Number(e.target.value) || undefined)} />
            <input className="h-11 rounded-lg border border-input bg-background/30 px-3" type="number" placeholder="Passi stimati" value={profile.passiStimati ?? ""} onChange={(e) => update("passiStimati", Number(e.target.value) || undefined)} />
          </div>
        ) : null}

        {step === 8 ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Riepilogo completato. Puoi modificare i dati anche da /app/settings.</p>
            <pre className="overflow-auto rounded-lg border border-input bg-background/40 p-3 text-xs">{JSON.stringify(profile, null, 2)}</pre>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
            Indietro
          </Button>
          <Button disabled={step === TOTAL_STEPS} onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}>
            Avanti
          </Button>
        </div>

        {status ? <p className="text-xs text-emerald-400">{status}</p> : null}
      </Card>
    </div>
  );
}
