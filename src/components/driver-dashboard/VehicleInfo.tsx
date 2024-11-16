import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectedCar {
  name: string;
  category: string;
  specs: Record<string, string>;
  price: number;
  period: string;
}

interface CheckoutSession {
  selected_car: SelectedCar;
}

interface VehicleInfoProps {
  driverId: string;
}

export const VehicleInfo = ({ driverId }: VehicleInfoProps) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ['vehicle-info', driverId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("checkout_sessions")
          .select("selected_car")
          .eq("driver_id", driverId)
          .eq("status", "active")
          .maybeSingle();

        if (error) {
          console.error('Error fetching vehicle info:', error);
          return null;
        }

        if (!data) return null;

        // Ensure the data matches our expected type
        const selectedCar = data.selected_car as unknown as SelectedCar;
        return { selected_car: selectedCar };
      } catch (error) {
        console.error('Error in query:', error);
        return null;
      }
    },
  });

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  if (!session?.selected_car) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Nenhum veículo ativo encontrado.</p>
      </Card>
    );
  }

  const { name, category, specs } = session.selected_car;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{name}</h3>
      <p className="text-muted-foreground mb-2">{category}</p>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm text-muted-foreground">{key}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};