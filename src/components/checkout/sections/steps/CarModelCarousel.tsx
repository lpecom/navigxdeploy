import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { CarModel } from "@/types/vehicles";

interface CarModelCarouselProps {
  carModels: CarModel[];
}

export const CarModelCarousel = ({ carModels }: CarModelCarouselProps) => {
  return (
    <Carousel className="w-full max-w-4xl mx-auto mb-8">
      <CarouselContent>
        {carModels.map((car) => (
          <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-1"
            >
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{car.name}</h4>
                  {car.description && (
                    <p className="text-sm text-gray-600">{car.description}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};