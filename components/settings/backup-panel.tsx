"use client";

import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { exportBackup, importBackup, type AppBackup } from "@/lib/indexeddb";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function BackupPanel() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onExport() {
    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const backup = await exportBackup();
      const dateToken = new Date().toISOString().replace(/[:.]/g, "-");
      downloadJson(`starebene-backup-${dateToken}.json`, backup);
      setStatus("Backup esportato con successo.");
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Errore durante export backup.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as AppBackup;

      if (parsed.version !== 1 || !Array.isArray(parsed.profile) || !Array.isArray(parsed.checkIns)) {
        throw new Error("Formato backup non valido.");
      }

      await importBackup(parsed);
      setStatus("Backup importato con successo.");
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Errore durante import backup.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Backup locale (IndexedDB)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Esporta o importa i tuoi dati personali in formato JSON. Nessun database esterno.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={onExport} disabled={busy}>
          {busy ? "Elaborazione..." : "Esporta backup"}
        </Button>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm">
          Importa backup
          <input className="hidden" type="file" accept="application/json" onChange={onImport} disabled={busy} />
        </label>
      </div>

      {status ? <p className="text-sm text-emerald-400">{status}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </Card>
  );
}
