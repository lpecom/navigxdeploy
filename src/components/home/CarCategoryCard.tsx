import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Car, Fuel, Gauge, Shield, MapPin, Wifi, DollarSign, Calendar } from "lucide-react";
import { CarSlider } from "./CarSlider";
import { carsByCategory } from "@/constants/cars";

interface CarCategoryProps {
  category: {
    name: string;
    models: string;
    price: string;
    period: string;
    location: string;
    availability: string;
    badge: string;
    specs: {
      passengers: number;
      luggage: number;
      transmission: string;
      fuel: string;
      mileage: string;
      insurance: string;
      wifi: boolean;
      consumption: string;
    };
  };
}

export const CarCategoryCard = ({ category }: CarCategoryProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-100">
      <Badge className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full">
        {category.badge}
      </Badge>
      
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {category.name}
        </CardTitle>
        <p className="text-gray-600 font-medium">{category.models}</p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {category.name === "USADINHO" && (
          <CarSlider cars={carsByCategory.USADINHO} category={category.name} />
        )}
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 text-navig" />
              <span>{category.specs.passengers} passageiros</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase className="w-4 h-4 text-navig" />
              <span>{category.specs.luggage} mala grande</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Car className="w-4 h-4 text-navig" />
              <span>{category.specs.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Fuel className="w-4 h-4 text-navig" />
              <span>{category.specs.fuel}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Gauge className="w-4 h-4 text-navig" />
              <span>{category.specs.consumption}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-4 h-4 text-navig" />
              <span>{category.specs.insurance}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-navig" />
              <span>{category.location}</span>
            </div>
            {category.specs.wifi && (
              <div className="flex items-center gap-2 text-gray-700">
                <Wifi className="w-4 h-4 text-navig" />
                <span>Wi-Fi incluso</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-navig font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {category.availability}
          </p>
        </div>
        
        <div className="text-2xl font-bold text-gray-900">
          <p className="text-sm text-gray-600 mb-1">A partir de</p>
          <div className="flex items-center gap-2 text-navig">
            <DollarSign className="w-6 h-6" />
            {category.price}
            <span className="text-base font-normal text-gray-600">{category.period}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-navig hover:bg-navig/90 text-white font-medium py-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          Quero esse
        </Button>
      </CardFooter>
    </Card>
  );
};