import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceHistoryProps {
  driverId: string;
}

interface MaintenanceRecord {
  id: string;
  driver_id: string;
  service_type: string;
  description: string;
  service_date: string;
  cost: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const MaintenanceHistory = ({ driverId }: MaintenanceHistoryProps) => {
  const { data: maintenanceRecords } = useQuery<MaintenanceRecord[]>({
    queryKey: ['maintenance-records', driverId],
    queryFn: async () => {
      const { data } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('driver_id', driverId)
        .order('service_date', { ascending: false });
      
      return data || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Manutenção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceRecords?.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{record.service_type}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(record.service_date), "PP", { locale: ptBR })}
                </p>
                <p className="text-sm text-gray-500">{record.description}</p>
              </div>
              <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                {record.status === 'completed' ? 'Concluído' : 'Agendado'}
              </Badge>
            </div>
          ))}

          {(!maintenanceRecords || maintenanceRecords.length === 0) && (
            <p className="text-center text-gray-500">
              Nenhum registro de manutenção encontrado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceHistory;