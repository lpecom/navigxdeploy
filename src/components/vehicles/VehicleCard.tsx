import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Car, Calendar, Tag } from "lucide-react";
import { getBrandLogo } from "@/utils/brandLogos";
import type { CarModel } from "./types";
import { motion } from "framer-motion";

interface VehicleCardProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  const brandLogoUrl = getBrandLogo(car.name);

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
            <h3 className="font-semibold text-lg">{car.name}</h3>
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
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {car.category?.name && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {car.category.name}
                </Badge>
              )}
              {car.year && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {car.year}
                </Badge>
              )}
            </div>
            
            {car.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {car.description}
              </p>
            )}
            
            {car.optionals && Object.entries(car.optionals).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(car.optionals).map(([key, value]) => (
                  <Badge 
                    key={key}
                    variant="secondary"
                    className="text-xs"
                  >
                    {`${key}: ${value}`}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};