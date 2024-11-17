import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

interface CarCategoryCardProps {
  category: Category;
}

export const CarCategoryCard = ({ category }: CarCategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="relative overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-xl"
        onClick={() => navigate(`/category/${category.id}`)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 flex flex-col h-full">
          {category.badge_text && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-navig/10 text-navig hover:bg-navig/20"
            >
              {category.badge_text}
            </Badge>
          )}
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-navig transition-colors duration-300">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-gray-600 flex-grow">
              {category.description}
            </p>
          )}
          
          <div className="mt-6 flex items-center text-navig">
            <span className="text-sm font-medium">Saiba mais</span>
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