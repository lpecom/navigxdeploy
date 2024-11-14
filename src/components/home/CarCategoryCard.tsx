import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Gauge } from "lucide-react";
import { CarSlider } from "./CarSlider";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CarCategoryProps {
  category: {
    id: string;
    name: string;
    badge_text: string | null;
    description: string | null;
  };
}

interface Specs {
  transmission?: string;
  motorization?: string;
  [key: string]: any;
}

export const CarCategoryCard = ({ category }: CarCategoryProps) => {
  const navigate = useNavigate();

  const { data: carModels, isLoading } = useQuery({
    queryKey: ["car-models", category.id],
    queryFn: async () => {
      if (!category.id) return [];
      
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", category.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!category.id,
  });

  const { data: offers } = useQuery({
    queryKey: ["category-offers", category.id],
    queryFn: async () => {
      if (!category.id) return null;
      
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("category_id", category.id)
        .order("price", { ascending: true })
        .limit(1);
      
      if (error) throw error;
      return data[0];
    },
    enabled: !!category.id,
  });

  const handleSelectCar = () => {
    if (!offers) return;
    
    sessionStorage.setItem('selectedCar', JSON.stringify({
      category: category.name,
      price: offers.price,
      period: offers.price_period,
      specs: offers.specs
    }));
    
    navigate('/plans');
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-100">
      {category.badge_text && (
        <Badge className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full">
          {category.badge_text}
        </Badge>
      )}
      
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {category.name}
        </CardTitle>
        {category.description && (
          <p className="text-sm text-gray-600">{category.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : carModels && carModels.length > 0 ? (
          <CarSlider cars={carModels} category={category.name} />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400">
            Nenhum veículo disponível
          </div>
        )}
        
        {offers?.specs && (
          <div className="space-y-4">
            {(offers.specs as Specs).transmission && (
              <div className="flex items-center gap-2 text-gray-700">
                <Car className="w-4 h-4 text-navig" />
                <span>{(offers.specs as Specs).transmission}</span>
              </div>
            )}
            {(offers.specs as Specs).motorization && (
              <div className="flex items-center gap-2 text-gray-700">
                <Gauge className="w-4 h-4 text-navig" />
                <span>{(offers.specs as Specs).motorization}</span>
              </div>
            )}
            {offers.availability && (
              <p className="text-navig font-semibold">
                {offers.availability}
              </p>
            )}
          </div>
        )}
        
        {offers && (
          <div className="text-2xl font-bold text-gray-900">
            <p className="text-sm text-gray-600 mb-1">A partir de</p>
            <div className="flex items-center gap-2 text-navig">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(offers.price)}
              <span className="text-base font-normal text-gray-600">
                /{offers.price_period}
              </span>
            </div>
          </div>
        )}
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