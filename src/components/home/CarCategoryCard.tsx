import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CarSlider } from "./CarSlider";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

interface Car {
  id: string;
  name: string;
  image: string;
  year: string;
  mileage?: string;
}

interface CarCategoryCardProps {
  category: Category;
  cars: Car[];
}

export const CarCategoryCard = ({ category, cars }: CarCategoryCardProps) => {
  const navigate = useNavigate();

  const handleCategorySelect = () => {
    sessionStorage.setItem('selectedCategory', JSON.stringify(category));
    navigate('/plans');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="relative overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-xl bg-white"
        onClick={handleCategorySelect}
      >
        <div className="relative h-48 overflow-hidden">
          <CarSlider cars={cars} category={category.name} />
          {category.badge_text && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 z-10 bg-white/90 text-navig hover:bg-white font-medium tracking-wide px-3 py-1"
            >
              {category.badge_text}
            </Badge>
          )}
        </div>
        
        <div className="relative p-6 flex flex-col h-full">
          <h3 className="text-xl font-medium text-gray-900 mb-2 tracking-tight group-hover:text-navig transition-colors duration-300">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm leading-relaxed text-gray-600 font-light mb-4">
              {category.description}
            </p>
          )}
          
          <div className="mt-auto flex items-center text-navig">
            <span className="text-sm font-medium tracking-wide uppercase">Ver planos</span>
            <svg 
              className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};