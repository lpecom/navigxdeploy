import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { CategoryEditDialog } from "./CategoryEditDialog";
import type { Category } from "@/types/offers";

interface CategoriesListProps {
  categories?: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onToggleVisibility: (category: Category) => void;
  isLoading?: boolean;
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onToggleVisibility,
  isLoading,
}: CategoriesListProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>Loading categories...</CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedCategory?.id === category.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelectCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  )}
                  {category.badge_text && (
                    <Badge variant="secondary">{category.badge_text}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(category);
                    }}
                  >
                    {category.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  );
};