import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "@/types/offers";

interface CategorySelectorProps {
  categories: Category[] | undefined;
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
}

export const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategorySelectorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!categories?.length) return null;

  const handleCategorySelect = (category: Category) => {
    onCategorySelect(category);
    sessionStorage.setItem('selectedCategory', JSON.stringify(category));
    toast({
      title: "Categoria selecionada!",
      description: "Agora vamos escolher seu plano.",
    });
    navigate('/reservar/planos');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Escolha uma categoria</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`p-6 cursor-pointer transition-colors ${
              selectedCategory?.id === category.id 
                ? 'bg-white/10 border-primary'
                : 'hover:bg-white/5'
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-gray-400 mt-2">{category.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};