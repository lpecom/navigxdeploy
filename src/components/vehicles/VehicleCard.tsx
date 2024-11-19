import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Car, Tag, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";
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

      return {
        rented: vehicles?.filter(v => v.status === 'rented').length || 0,
        available: vehicles?.filter(v => v.status === 'available').length || 0,
        forSale: vehicles?.filter(v => v.status === 'for_sale').length || 0,
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(car)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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

            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-lg font-semibold">{fleetStats?.rented || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Alugados</p>
              </div>

              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-lg font-semibold">{fleetStats?.available || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Disponíveis</p>
              </div>

              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-lg font-semibold">{fleetStats?.forSale || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">À Venda</p>
              </div>
            </div>

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