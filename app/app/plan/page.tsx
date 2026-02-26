"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, isProfileComplete } from "@/lib/indexeddb";

export default function PlanPage() {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    getProfile().then((profile) => {
      setReady(isProfileComplete(profile));
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Piano</h1>
      <Card>
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
          <p className="text-sm text-muted-foreground">Profilo completo. La generazione piano verrà attivata nei prossimi milestone.</p>
        ) : null}
      </Card>
    </div>
  );
}
