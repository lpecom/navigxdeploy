import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Gauge } from "lucide-react";
import { CarSlider } from "./CarSlider";
import { carsByCategory } from "@/constants/cars";
import { useNavigate } from "react-router-dom";

interface CarCategoryProps {
  category: {
    name: string;
    badge: string;
    specs: {
      motorization?: string;
      transmission: string;
    };
    availability: string;
    price: string;
    period: string;
  };
}

export const CarCategoryCard = ({ category }: CarCategoryProps) => {
  const navigate = useNavigate();

  const handleSelectCar = () => {
    sessionStorage.setItem('selectedCar', JSON.stringify({
      category: category.name,
      specs: category.specs,
      price: category.price,
      period: category.period
    }));
    
    navigate('/plans');
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-100">
      <Badge className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full">
        {category.badge}
      </Badge>
      
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {category.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {category.name === "USADINHO" && (
          <CarSlider cars={carsByCategory.USADINHO} category={category.name} />
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Car className="w-4 h-4 text-navig" />
            <span>{category.specs.transmission}</span>
          </div>
          {category.specs.motorization && (
            <div className="flex items-center gap-2 text-gray-700">
              <Gauge className="w-4 h-4 text-navig" />
              <span>{category.specs.motorization}</span>
            </div>
          )}
          <p className="text-navig font-semibold">
            {category.availability}
          </p>
        </div>
        
        <div className="text-2xl font-bold text-gray-900">
          <p className="text-sm text-gray-600 mb-1">A partir de</p>
          <div className="flex items-center gap-2 text-navig">
            {category.price}
            <span className="text-base font-normal text-gray-600">{category.period}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSelectCar}
          className="w-full bg-navig hover:bg-navig/90 text-white font-medium py-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Quero esse
        </Button>
      </CardFooter>
    </Card>
  );
};