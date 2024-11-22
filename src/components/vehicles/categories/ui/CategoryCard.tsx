import { Card } from "@/components/ui/card";
import { CategoryCardHeader } from "./CategoryCardHeader";
import type { Category } from "@/types/offers";

interface CategoryCardProps {
  category: Category;
  onToggleVisibility: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryCard = ({
  category,
  onToggleVisibility,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${
      !category.is_active ? "opacity-60" : ""
    }`}>
      <div className="p-6">
        <CategoryCardHeader
          category={category}
          onToggleVisibility={onToggleVisibility}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        
        <p className="text-sm text-muted-foreground mt-4">
          {category.description || "Sem descrição"}
        </p>
      </div>
    </Card>
  );
};