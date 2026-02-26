"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ALLOWED_NEXT_ROUTES: Route[] = ["/app", "/app/check-in", "/app/plan", "/app/today", "/app/settings"];

function resolveNextRoute(nextValue: string | null): Route {
  if (!nextValue) return "/app";

  return ALLOWED_NEXT_ROUTES.find((route) => route === nextValue) ?? "/app";
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Errore durante il login");
      setLoading(false);
      return;
    }

    const destination = resolveNextRoute(params.get("next"));
    router.push(destination);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Login con password</h1>
          <p className="text-sm text-muted-foreground">Inserisci email e password per accedere.</p>
        </div>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="h-10 w-full rounded-md border border-input px-3"
            type="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="h-10 w-full rounded-md border border-input px-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </Button>
        </form>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </Card>
    </main>
  );
}
