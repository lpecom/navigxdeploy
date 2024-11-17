import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Car } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

interface CarCategoryCardProps {
  category: Category;
  index: number;
}

// Array of placeholder images from Unsplash
const categoryImages = [
  "photo-1488590528505-98d2b5aba04b",
  "photo-1581091226825-a6a2a5aee158",
  "photo-1513836279014-a89f7a76ae86",
  "photo-1504893524553-b855bce32c67",
  "photo-1615729947596-a598e5de0ab3",
  "photo-1582562124811-c09040d0a901"
];

export const CarCategoryCard = ({ category, index }: CarCategoryCardProps) => {
  const navigate = useNavigate();
  const imageUrl = `https://images.unsplash.com/${categoryImages[index % categoryImages.length]}?auto=format&fit=crop&w=800&q=80`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="relative overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-xl bg-white"
        onClick={() => navigate(`/category/${category.id}`)}
      >
        {/* Category Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {category.badge_text && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-white/90 text-navig hover:bg-white font-medium tracking-wide px-3 py-1"
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
          
          {/* Category Stats */}
          <div className="mt-auto space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-navig" />
              <span>4-5 Passageiros</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-navig" />
              <span>Disponível Imediatamente</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Car className="w-4 h-4 mr-2 text-navig" />
              <span>Câmbio Automático</span>
            </div>
          </div>
          
          <div className="mt-6 flex items-center text-navig">
            <span className="text-sm font-medium tracking-wide uppercase">Saiba mais</span>
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