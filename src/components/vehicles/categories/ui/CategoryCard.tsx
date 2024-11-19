import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryCardHeader } from "./CategoryCardHeader";
import { CategoryModels } from "../CategoryModels";
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
      <div className="p-6 space-y-6">
        <CategoryCardHeader
          category={category}
          onToggleVisibility={onToggleVisibility}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="models">Modelos</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            <p className="text-sm text-muted-foreground">
              {category.description || "Sem descrição"}
            </p>
          </TabsContent>
          <TabsContent value="models" className="mt-4">
            <CategoryModels categoryId={category.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};