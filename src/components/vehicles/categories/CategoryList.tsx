import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { CategoryCard } from "./ui/CategoryCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { CategoryModelsDialog } from "./CategoryModelsDialog";
import type { Category } from "@/types/offers";

export const CategoryList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*, car_models(count)")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from("categories")
        .update({ is_active: !category.is_active })
        .eq("id", category.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Sucesso",
        description: "Visibilidade da categoria atualizada",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error: modelsError } = await supabase
        .from("car_models")
        .update({ category_id: null })
        .eq("category_id", id);
      
      if (modelsError) throw modelsError;

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Categorias de Veículos</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Categorias de Veículos</h2>
        <Button onClick={() => setIsAddingCategory(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {categories?.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggleVisibility={toggleVisibilityMutation.mutate}
            onEdit={setEditingCategory}
            onDelete={(category) => {
              if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
                deleteMutation.mutate(category);
              }
            }}
          />
        ))}
      </div>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSuccess={() => setIsAddingCategory(false)}
          />
        </DialogContent>
      </Dialog>

      <CategoryModelsDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
    </div>
  );
};
