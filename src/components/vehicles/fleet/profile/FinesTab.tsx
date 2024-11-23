import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Sync } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FinesTabProps {
  vehicleId: string;
  plate: string;
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
      return data;
    }
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/functions/v1/fetch-vehicle-fines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plate, vehicleId }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync fines');
      }

      const result = await response.json();
      
      toast({
        title: "Multas sincronizadas",
        description: `${result.fines?.length || 0} multas encontradas.`,
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
          <Sync className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Multas'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fines?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma multa encontrada
            </p>
          )}
          {fines?.map((fine) => (
            <div
              key={`${fine.fine_code}-${fine.fine_date}`}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{fine.fine_description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {format(new Date(fine.fine_date), "PPP", { locale: ptBR })}
                  </span>
                  <span>{fine.fine_location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  R$ {fine.fine_amount?.toFixed(2)}
                </p>
                <Badge variant="secondary">
                  {fine.fine_points} pontos
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};