import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { MaintenanceRecord } from "@/types/vehicles";

interface MaintenanceTabProps {
  maintenanceHistory: MaintenanceRecord[];
}

export const MaintenanceTab = ({ maintenanceHistory }: MaintenanceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Manutenções</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceHistory?.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{record.service_type}</p>
                <p className="text-sm text-muted-foreground">
                  {record.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(record.service_date), "PP", { locale: ptBR })}
                </p>
              </div>
              <Badge
                variant={record.status === 'completed' ? 'default' : 'secondary'}
              >
                {record.status === 'completed' ? 'Concluído' : 'Agendado'}
              </Badge>
            </div>
          ))}
          {(!maintenanceHistory || maintenanceHistory.length === 0) && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum registro de manutenção encontrado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
