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
          {carModels.map((car, index) => (
            <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-1"
              >
                <Card className="overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 border-0">
                  <div className="relative aspect-[16/9]">
                    {car.image_url ? (
                      <img
                        src={car.image_url}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white border-0"
                    >
                      {car.category?.name}
                    </Badge>
                  </div>
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex flex-col items-center text-center p-3 bg-white/5 rounded-lg">
                        <Users className="w-5 h-5 mb-2 text-primary" />
                        <span className="text-sm">{car.passengers || 5} lugares</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-3 bg-white/5 rounded-lg">
                        <Gauge className="w-5 h-5 mb-2 text-primary" />
                        <span className="text-sm">{car.transmission || "Auto"}</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-3 bg-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 mb-2 text-primary" />
                        <span className="text-sm">{car.year}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-12 bg-white/10 text-white hover:bg-white/20 border-0" />
        <CarouselNext className="absolute -right-12 bg-white/10 text-white hover:bg-white/20 border-0" />
      </Carousel>
    </div>
  );
};