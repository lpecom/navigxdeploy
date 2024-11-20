import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CarModel, FleetVehicle } from "@/types/vehicles";

interface VehicleCardProps {
  car: CarModel;
  onEdit?: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  const navigate = useNavigate();
  const brandLogoUrl = car.brand_logo_url;

  const { data: fleetStats } = useQuery({
    queryKey: ['fleet-stats', car.id],
    queryFn: async () => {
      const { data: vehicles, error } = await supabase
        .from('fleet_vehicles')
        .select('status')
        .eq('car_model_id', car.id);

      if (error) {
        console.error('Error fetching fleet stats:', error);
        return null;
      }

      const statuses = vehicles?.map(v => v.status?.toLowerCase() || '') || [];
      
      return {
        rented: statuses.filter(s => s === 'rented').length,
        available: statuses.filter(s => s === 'available').length,
        forSale: statuses.filter(s => s === 'for_sale').length,
        total: vehicles?.length || 0
      };
    }
  });

  const handleClick = () => {
    navigate(`/admin/vehicles/${car.id}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {car.image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={car.image_url}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-lg">{car.name}</h3>
            {car.year && (
              <p className="text-sm text-muted-foreground">
                Ano: {car.year}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {fleetStats && fleetStats.total > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Alugados</span>
                  <span className="font-medium text-orange-600">{fleetStats.rented}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Disponíveis</span>
                  <span className="font-medium text-green-600">{fleetStats.available}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">À Venda</span>
                  <span className="font-medium text-blue-600">{fleetStats.forSale}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium pt-1 border-t">
                  <span>Total na Frota</span>
                  <span>{fleetStats.total}</span>
                </div>
              </div>
            )}

            {car.category?.name && (
              <Badge variant="secondary" className="w-fit">
                {car.category.name}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};