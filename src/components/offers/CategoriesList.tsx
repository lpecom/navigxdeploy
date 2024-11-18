import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { CategoryEditDialog } from "./CategoryEditDialog";
import { CategoryCard } from "./category-list/CategoryCard";
import { DeleteDialog } from "./category-list/DeleteDialog";
import { RenameDialog } from "./category-list/RenameDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/types/offers";

interface CategoriesListProps {
  categories?: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onToggleVisibility: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  isLoading?: boolean;
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onToggleVisibility,
  onDeleteCategory,
  isLoading,
}: CategoriesListProps) => {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [renamingCategory, setRenamingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleRename = async () => {
    if (!renamingCategory || !newCategoryName.trim()) return;

    const { error } = await supabase
      .from("categories")
      .update({ name: newCategoryName.trim() })
      .eq("id", renamingCategory.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao renomear categoria",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Categoria renomeada com sucesso",
      });
      setRenamingCategory(null);
      setNewCategoryName("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>Carregando categorias...</CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory?.id === category.id}
              onSelect={onSelectCategory}
              onToggleVisibility={onToggleVisibility}
              onEdit={setEditingCategory}
              onRename={(category) => {
                setRenamingCategory(category);
                setNewCategoryName(category.name);
              }}
              onDelete={setCategoryToDelete}
            />
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

      <DeleteDialog
        category={categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={(category) => {
          onDeleteCategory(category);
          setCategoryToDelete(null);
        }}
      />

      <RenameDialog
        category={renamingCategory}
        newName={newCategoryName}
        onNewNameChange={setNewCategoryName}
        onClose={() => setRenamingCategory(null)}
        onConfirm={handleRename}
      />
    </>
  );
};