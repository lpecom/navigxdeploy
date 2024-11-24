import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Car, Users, Gauge, Calendar } from "lucide-react";
import { getBrandLogo } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";

interface CarModelCarouselProps {
  carModels: CarModel[];
}

export const CarModelCarousel = ({ carModels }: CarModelCarouselProps) => {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {carModels.map((car, index) => {
            const brandLogo = getBrandLogo(car.name);
            
            return (
              <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-1"
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-0 backdrop-blur-sm">
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full p-1.5">
                        {brandLogo ? (
                          <img
                            src={brandLogo}
                            alt="Brand logo"
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <Car className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-xs font-medium text-white pr-1.5">
                          {car.name}
                        </span>
                      </div>
                      
                      <div className="relative aspect-[16/9]">
                        {car.image_url ? (
                          <img
                            src={car.image_url}
                            alt={car.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Car className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white border-0 text-xs"
                        >
                          {car.category?.name}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center text-center p-2 bg-white/5 rounded-md backdrop-blur-sm transition-colors hover:bg-white/10">
                          <Users className="w-4 h-4 mb-1 text-primary" />
                          <span className="text-xs text-gray-300">{car.passengers || 5}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 bg-white/5 rounded-md backdrop-blur-sm transition-colors hover:bg-white/10">
                          <Gauge className="w-4 h-4 mb-1 text-primary" />
                          <span className="text-xs text-gray-300">{car.transmission || "Auto"}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 bg-white/5 rounded-md backdrop-blur-sm transition-colors hover:bg-white/10">
                          <Calendar className="w-4 h-4 mb-1 text-primary" />
                          <span className="text-xs text-gray-300">{car.year}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-8 bg-white/10 text-white hover:bg-white/20 border-0 w-8 h-8" />
        <CarouselNext className="absolute -right-8 bg-white/10 text-white hover:bg-white/20 border-0 w-8 h-8" />
      </Carousel>
    </div>
  );
};