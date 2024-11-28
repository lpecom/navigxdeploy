import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Gauge, Zap } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicles";

interface VehicleCardProps {
  vehicle: FleetVehicle & {
    total_revenue?: number;
    fipe_price?: number;
  };
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const profitabilityPercentage = vehicle.fipe_price && vehicle.total_revenue 
    ? Math.round((vehicle.total_revenue / vehicle.fipe_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-[300px]"
    >
      <Card className="overflow-hidden">
        <div className="p-6 space-y-4" style={{ backgroundColor: '#FEF7CD' }}>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-black/10 rounded-full">
              <Gauge className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">
              {profitabilityPercentage}% recommend
            </span>
          </div>

          <div className="relative aspect-[16/9]">
            <img
              src={vehicle.car_model?.image_url || '/placeholder.svg'}
              alt={vehicle.car_model?.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {vehicle.car_model?.name}
            </h3>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span>{vehicle.current_km} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>R$ {vehicle.car_model?.daily_price}/dia</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};