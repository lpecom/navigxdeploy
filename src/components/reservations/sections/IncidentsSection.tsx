import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IncidentsSectionProps {
  incidents: Array<{
    date: string;
    type: string;
    amount: number;
    status: string;
  }>;
}

export const IncidentsSection = ({ incidents }: IncidentsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Incidentes e Multas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{incident.type}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(incident.date), "PP", { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600">
                  R$ {incident.amount.toFixed(2)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {incident.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};