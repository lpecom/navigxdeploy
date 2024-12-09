import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CarSlider } from "./CarSlider";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { CarModel } from '@/types/vehicles';

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

interface CarCategoryCardProps {
  category: Category;
  cars?: CarModel[];
}

export const CarCategoryCard = ({ category, cars = [] }: CarCategoryCardProps) => {
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const handleCategorySelect = () => {
    // Add the category to cart as a car_group item
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: category.id,
        type: 'car_group',
        name: category.name,
        quantity: 1,
        unitPrice: 0, // This will be set later in the checkout process
        totalPrice: 0,
        category: category.name,
        period: 'weekly' // Default period
      }
    });

    // Store category data for the checkout process
    sessionStorage.setItem('selectedCategory', JSON.stringify(category));
    
    // Navigate directly to checkout
    navigate('/checkout');
    
    toast.success('Categoria selecionada! Continue seu checkout.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="relative overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50"
        onClick={handleCategorySelect}
      >
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <CarSlider cars={cars} category={category.name} />
          {category.badge_text && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-medium tracking-wide px-3 py-1"
            >
              {category.badge_text}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
        </div>
        
        <div className="relative p-6 flex flex-col h-full bg-gradient-to-b from-gray-900/50 to-gray-800/50">
          <h3 className="text-xl font-medium text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors duration-300">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm leading-relaxed text-gray-300 font-light mb-4">
              {category.description}
            </p>
          )}

          {cars.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {cars.slice(0, 3).map((car) => (
                <div key={car.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-800/50">
                  {car.image_url ? (
                    <img 
                      src={car.image_url} 
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs text-white font-medium truncate">{car.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-auto flex items-center text-primary-400 group-hover:text-primary-300 transition-colors duration-300">
            <span className="text-sm font-medium tracking-wide uppercase">Selecionar categoria</span>
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