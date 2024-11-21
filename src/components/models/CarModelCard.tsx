import { motion } from "framer-motion";
import { Users, Briefcase, GaugeCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CarModel } from "@/types/vehicles";

interface CarModelCardProps {
  model: CarModel;
  index: number;
}

export const CarModelCard = ({ model, index }: CarModelCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group">
        <div className="relative aspect-[16/9] overflow-hidden">
          {model.image_url ? (
            <img
              src={model.image_url}
              alt={model.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          {model.vehicle_type && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-white/90"
            >
              {model.vehicle_type}
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {model.name} {model.year}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {model.description || "Experience luxury and comfort with our premium vehicle."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y">
            <div className="flex flex-col items-center text-center">
              <Users className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{model.passengers || 5} Seats</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Briefcase className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{model.luggage || 4} Bags</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <GaugeCircle className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{model.transmission || "Auto"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-2xl font-bold text-primary">
                ${model.daily_price?.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/day</span>
              </p>
            </div>
            <Button>View Details</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};