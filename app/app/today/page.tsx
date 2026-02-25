import { Card } from "@/components/ui/card";

export default function TodayPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Oggi</h1>
      <Card>
        <p className="text-sm text-muted-foreground">Check giornaliero rapido: verrà completato nel milestone 6.</p>
      </Card>
    </div>
  );
}
