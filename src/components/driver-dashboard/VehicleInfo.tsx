import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Calendar, Fuel, Gauge } from "lucide-react";

interface SelectedCar {
  name: string;
  category: string;
  specs: Record<string, string>;
  price: number;
  period: string;
}

interface CheckoutSession {
  selected_car: SelectedCar;
  fleet_vehicles?: {
    car_model: {
      name: string;
      image_url: string | null;
      description: string | null;
    };
  }[];
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
          .select(`
            selected_car,
            fleet_vehicles (
              car_model (
                name,
                image_url,
                description
              )
            )
          `)
          .eq("driver_id", driverId)
          .eq("status", "active")
          .maybeSingle();

        if (error) {
          console.error('Error fetching vehicle info:', error);
          return null;
        }

        return data as CheckoutSession;
      } catch (error) {
        console.error('Error in query:', error);
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>
    );
  }

  if (!session?.selected_car) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Car className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-lg font-medium text-gray-900">Nenhum veículo ativo</p>
            <p className="text-sm text-gray-500">
              Você não possui nenhum veículo ativo no momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { name, category, specs } = session.selected_car;
  const carModel = session.fleet_vehicles?.[0]?.car_model;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Informações do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {carModel?.image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={carModel.image_url}
                alt={carModel.name || name}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{carModel?.name || name}</h3>
            <p className="text-sm text-gray-500">{category}</p>
            {carModel?.description && (
              <p className="text-sm text-gray-500">{carModel.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {specs && Object.entries(specs).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-500">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            Status do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Próxima Revisão
                  </span>
                </div>
                <p className="text-sm text-gray-500">Em 3 meses</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Combustível
                  </span>
                </div>
                <p className="text-sm text-gray-500">75% cheio</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">
                  Status Geral
                </h4>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]" />
                </div>
                <p className="text-xs text-gray-500">
                  Seu veículo está em ótimas condições
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};