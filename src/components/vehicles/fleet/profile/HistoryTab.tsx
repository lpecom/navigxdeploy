import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Aluguéis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-4">
          Histórico de aluguéis em desenvolvimento
        </p>
      </CardContent>
    </Card>
  );
};