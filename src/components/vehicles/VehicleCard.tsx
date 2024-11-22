import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Pencil } from "lucide-react";
import { getBrandLogo, getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleImage } from "./card/VehicleImage";
import { VehicleStats } from "./card/VehicleStats";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ModelEditDialog } from "./card/ModelEditDialog";

interface VehicleCardProps {
  car: CarModel;
}

export const VehicleCard = ({ car }: VehicleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const brandLogoUrl = getBrandLogo(car.name);
  const brandName = getBrandFromModel(car.name);

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

      const statuses = vehicles?.map(v => v.status) || [];
      
      return {
        rented: statuses.filter(s => s === 'rented').length,
        available: statuses.filter(s => s === 'available').length,
        forSale: statuses.filter(s => s === 'for_sale').length,
        maintenance: statuses.filter(s => s === 'maintenance').length,
        bodyShop: statuses.filter(s => s === 'body_shop').length,
        deactivated: statuses.filter(s => s === 'deactivated').length,
        management: statuses.filter(s => s === 'management').length,
        accident: statuses.filter(s => s === 'accident').length,
        total: statuses.length
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
                alt={`${brandName} brand`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Car className="w-8 h-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm text-muted-foreground font-medium">{brandName}</p>
              <h3 className="font-semibold text-lg">{car.name}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <VehicleImage car={car} />
          
          {fleetStats && fleetStats.total > 0 && (
            <VehicleStats stats={fleetStats} />
          )}

          {car.category?.name && (
            <Badge variant="secondary" className="w-fit">
              {car.category.name}
            </Badge>
          )}
        </CardContent>
      </Card>

      <ModelEditDialog
        model={car}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </motion.div>
  );
};