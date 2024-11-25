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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="space-y-4">
        <CarModelDisplay categoryId={selectedCategory.id} />
        <CategoryBenefits category={selectedCategory} />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white gap-2 px-6 py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar para planos
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};