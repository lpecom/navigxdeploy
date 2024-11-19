import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IncidentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-4">
          Registro de ocorrências em desenvolvimento
        </p>
      </CardContent>
    </Card>
  );
};