import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Car {
  id: string;
  name: string;
  image: string;
  year: string;
  mileage: string;
}

interface CarSliderProps {
  cars: Car[];
  category: string;
}

export const CarSlider = ({ cars, category }: CarSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === cars.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cars.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative group">
      <div className="relative h-48 overflow-hidden rounded-lg">
        <div
          className="absolute w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cars.map((car, index) => (
            <div
              key={car.id}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: `${index * 100}%` }}
            >
              <img
                src={car.image}
                alt={car.name}
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                <p className="text-sm font-medium">{car.name} {car.year}</p>
                <p className="text-xs">{car.mileage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
    </div>
  );
};