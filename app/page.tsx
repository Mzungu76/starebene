import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-4 py-10">
      <div className="space-y-4 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Milestone 1</p>
        <h1 className="text-3xl font-bold md:text-5xl">Stare Bene: dieta + allenamento, senza perdere tempo.</h1>
        <p className="max-w-2xl text-muted-foreground">
          Onboarding guidato, piano settimanale pasti e piano trimestrale allenamento in un&apos;app
          responsive pensata per desktop e mobile.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/login">
          <Button>Accedi con password</Button>
        </Link>
        <Link href="/app">
          <Button variant="outline">Vai alla dashboard demo</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Check-in wizard</h2>
          <p className="text-sm text-muted-foreground">Raccoglie i dati essenziali in pochi step.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Piano settimanale</h2>
          <p className="text-sm text-muted-foreground">Pasti rapidi, ingredienti comuni e lista spesa.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Routine quotidiana</h2>
          <p className="text-sm text-muted-foreground">Check giornaliero rapido in meno di 60 secondi.</p>
        </Card>
      </div>
    </main>
  );
}
