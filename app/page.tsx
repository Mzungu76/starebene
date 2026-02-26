import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-4 py-10">
      <div className="space-y-5 text-center md:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Stare Bene · Milestone 1</p>
        <h1 className="text-3xl font-bold leading-tight md:text-6xl">Nutrizione e training realistici, in un flusso pulito.</h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Un pannello tecnico, chiaro e mobile-first per gestire check-in, piano settimanale e routine quotidiana
          senza frizione.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/login">
          <Button>Accedi</Button>
        </Link>
        <Link href="/app">
          <Button variant="outline">Apri dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Check-in guidato</h2>
          <p className="mt-2 text-sm text-muted-foreground">Raccolta dati semplice e progressiva.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Piano rapido</h2>
          <p className="mt-2 text-sm text-muted-foreground">Focus su pasti pratici e allenamenti sostenibili.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Daily flow</h2>
          <p className="mt-2 text-sm text-muted-foreground">Aggiornamenti giornalieri in pochi secondi.</p>
        </Card>
      </div>
    </main>
  );
}
