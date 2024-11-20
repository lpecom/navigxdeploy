import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const FleetStatusCount = () => {
  const { data: statusCounts, isLoading } = useQuery({
    queryKey: ['fleet-status-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('status')
        .not('status', 'is', null);

      if (error) throw error;

      const counts = data.reduce((acc: Record<string, number>, vehicle) => {
        const status = vehicle.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return counts;
    },
  });

  if (isLoading) {
    return <div>Loading status counts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statusCounts && Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground capitalize">
                {status.replace('_', ' ')}
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};