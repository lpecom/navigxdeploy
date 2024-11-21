import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CarModel } from '@/types/vehicles';

interface CarSliderProps {
  cars?: CarModel[];
  category: string;
}

export const CarSlider = ({ cars = [], category }: CarSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === (cars?.length ?? 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? (cars?.length ?? 1) - 1 : prevIndex - 1
    );
  };

  // Fallback image for when no cars are available
  const fallbackImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80";

  if (!cars?.length) {
    return (
      <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
        <img
          src={fallbackImage}
          alt="Luxury Car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-white font-medium">Coming Soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative h-48 md:h-64 overflow-hidden rounded-lg bg-gray-100">
        <div
          className="absolute w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cars.map((car, index) => (
            <div
              key={car.id}
              className={cn(
                "absolute w-full h-full transition-opacity duration-500",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
              style={{ left: `${index * 100}%` }}
            >
              <img
                src={car.image_url || fallbackImage}
                alt={car.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                <p className="text-sm font-medium">
                  {car.name} {car.year}
                </p>
                {car.description && (
                  <p className="text-xs">{car.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {cars.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};