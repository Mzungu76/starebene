import Link from "next/link";

import { BackupPanel } from "@/components/settings/backup-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Impostazioni</h1>

      <Card className="space-y-3">
        <p className="text-sm text-muted-foreground">Gestione profilo e preferenze utente.</p>
        <Link href="/api/auth/signout">
          <Button variant="outline">Logout</Button>
        </Link>
      </Card>

      <BackupPanel />
    </div>
  );
}
