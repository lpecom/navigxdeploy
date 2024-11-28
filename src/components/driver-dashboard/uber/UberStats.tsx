import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Clock, MapPin, Car } from "lucide-react";

interface UberStatsProps {
  driverId: string;
}

export const UberStats = ({ driverId }: UberStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['uber-stats', driverId],
    queryFn: async () => {
      const { data: integration } = await supabase
        .from('driver_uber_integrations')
        .select('*')
        .eq('driver_id', driverId)
        .single();

      if (!integration) {
        throw new Error('No Uber integration found');
      }

      const { data, error } = await supabase.functions.invoke('uber-stats', {
        body: { integrationId: integration.id }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!driverId,
  });

  const metrics = [
    {
      title: "Ganhos Totais",
      value: stats?.earnings ? `R$ ${stats.earnings.toFixed(2)}` : "R$ 0,00",
      icon: DollarSign,
      description: "Últimos 30 dias"
    },
    {
      title: "Horas Online",
      value: stats?.hoursOnline?.toString() || "0",
      icon: Clock,
      description: "Últimos 30 dias"
    },
    {
      title: "Distância",
      value: stats?.distance ? `${stats.distance}km` : "0km",
      icon: MapPin,
      description: "Últimos 30 dias"
    },
    {
      title: "Corridas",
      value: stats?.trips?.toString() || "0",
      icon: Car,
      description: "Últimos 30 dias"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};