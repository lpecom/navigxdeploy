import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calendar, Gauge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VehicleInfoProps {
  driverId: string;
}

interface SelectedCar {
  name: string;
  category: string;
  specs: {
    plan: string;
    consumption: string;
  };
  price: number;
  period: string;
}

interface CheckoutSession {
  selected_car: SelectedCar;
}

const VehicleInfo = ({ driverId }: VehicleInfoProps) => {
  const { data: checkoutSession } = useQuery<CheckoutSession | null>({
    queryKey: ['driver-vehicle', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select('selected_car')
        .eq('driver_id', driverId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vehicle info:', error);
        return null;
      }

      if (!data) return null;
      
      // Parse the JSON data and ensure it matches our SelectedCar type
      const parsedCar = data.selected_car as SelectedCar;
      return { selected_car: parsedCar };
    },
  });

  if (!checkoutSession?.selected_car) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Nenhum veículo ativo encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  const car = checkoutSession.selected_car;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Informações do Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">{car.name}</p>
              <p className="text-sm text-gray-500">{car.category}</p>
            </div>
          </div>
          
          {car.specs && (
            <>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Plano</p>
                  <p className="text-sm text-gray-500">{car.specs.plan}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Gauge className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Consumo</p>
                  <p className="text-sm text-gray-500">{car.specs.consumption}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Status do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Valor Mensal</p>
              <p className="text-lg font-medium">R$ {car.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Período</p>
              <p className="text-lg font-medium">{car.period}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleInfo;