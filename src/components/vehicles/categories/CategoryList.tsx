import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export const CategoryList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["car-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_groups")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("car_groups")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    },
  });

  if (isLoading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Categorias de Veículos</h2>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.description || "Sem descrição"}
              </p>
            </CardContent>
          </Card>
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

      <Dialog
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSuccess={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};