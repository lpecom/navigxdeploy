import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import { getBrandLogo } from "@/utils/brandLogos";
import type { CarModel } from "./types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VehicleCardProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  const brandLogoUrl = getBrandLogo(car.name);

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

      const statuses = vehicles?.map(v => v.status?.toLowerCase() || '');
      
      return {
        rented: statuses.filter(s => s.includes('alugado') || s.includes('locado')).length || 0,
        available: statuses.filter(s => s.includes('disponivel') || s.includes('disponível')).length || 0,
        forSale: statuses.filter(s => s.includes('venda')).length || 0,
        total: vehicles?.length || 0
      };
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            {brandLogoUrl ? (
              <img 
                src={brandLogoUrl} 
                alt={`${car.name} brand`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Car className="w-8 h-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm text-muted-foreground font-medium">Marca</p>
              <h3 className="font-semibold text-lg">{car.name.split(' ')[0]}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {car.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <img
                src={car.image_url}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Modelo</span>
              <span className="font-medium">{car.name.split(' ').slice(1).join(' ')}</span>
            </div>

            {fleetStats && fleetStats.total > 0 && (
              <div className="space-y-2 pt-2 border-t text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Alugados</span>
                  <span className="font-medium text-orange-600">{fleetStats.rented}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Disponíveis</span>
                  <span className="font-medium text-green-600">{fleetStats.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">À Venda</span>
                  <span className="font-medium text-blue-600">{fleetStats.forSale}</span>
                </div>
              </div>
            )}

            {car.category?.name && (
              <Badge variant="secondary" className="w-fit">
                {car.category.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};