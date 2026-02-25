import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-medium">Settimana dieta</h2>
          <p className="text-sm text-muted-foreground">Stato piano alimentare: da generare.</p>
        </Card>
        <Card>
          <h2 className="font-medium">Allenamenti</h2>
          <p className="text-sm text-muted-foreground">Nessuna sessione registrata.</p>
        </Card>
        <Card>
          <h2 className="font-medium">Trend</h2>
          <p className="text-sm text-muted-foreground">Energia e aderenza appariranno qui.</p>
        </Card>
      </div>
    </div>
  );
}
