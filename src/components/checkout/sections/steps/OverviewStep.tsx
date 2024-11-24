import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CategoryBenefits } from "./overview/CategoryBenefits";
import { CarModelDisplay } from "./overview/CarModelDisplay";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OverviewStepProps {
  onNext: () => void;
}

export const OverviewStep = ({ onNext }: OverviewStepProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  useEffect(() => {
    const categoryData = sessionStorage.getItem('selectedCategory');
    if (categoryData) {
      try {
        setSelectedCategory(JSON.parse(categoryData));
      } catch (error) {
        console.error('Error parsing category data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!selectedCategory) return null;

  return (
    <div className="space-y-6">
      <CategoryBenefits category={selectedCategory} />
      <CarModelDisplay categoryId={selectedCategory.id} />

      <div className="flex justify-end mt-8">
        <Button 
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          Continuar para planos
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};