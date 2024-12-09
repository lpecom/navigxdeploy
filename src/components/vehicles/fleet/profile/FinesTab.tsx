import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinesTabProps {
  vehicleId: string;
  plate: string;
}

interface Fine {
  id: string;
  fine_code: string;
  fine_description: string;
  fine_date: string;
  fine_location: string;
  fine_amount: number;
  fine_points: number;
  fine_status: string;
}

export const FinesTab = ({ vehicleId, plate }: FinesTabProps) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: fines, refetch } = useQuery({
    queryKey: ['vehicle-fines', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_fines')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('fine_date', { ascending: false });

      if (error) throw error;
      return data as Fine[];
    }
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-vehicle-fines', {
        body: { plate, vehicleId },
      });

      if (error) throw error;
      
      toast({
        title: "Multas sincronizadas",
        description: `${data.fines?.length || 0} multas encontradas.`,
      });

      refetch();
    } catch (error) {
      console.error('Error syncing fines:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sincronizar as multas.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getFineStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Multas do Veículo</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Multas'}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {!fines || fines.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma multa encontrada
              </p>
            ) : (
              fines.map((fine) => (
                <div
                  key={`${fine.fine_code}-${fine.fine_date}`}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{fine.fine_description}</p>
                      <Badge variant={getFineStatusColor(fine.fine_status)}>
                        {fine.fine_points} pontos
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span>
                        Data: {format(new Date(fine.fine_date), "PPP", { locale: ptBR })}
                      </span>
                      <span>Local: {fine.fine_location}</span>
                      <span>Código: {fine.fine_code}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">
                      R$ {fine.fine_amount.toFixed(2)}
                    </p>
                    <Badge variant={getFineStatusColor(fine.fine_status)}>
                      {fine.fine_status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};