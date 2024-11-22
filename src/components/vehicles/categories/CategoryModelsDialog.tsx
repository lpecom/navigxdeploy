import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModelList } from "./models/ModelList";
import { ModelSearchDropdown } from "./models/ModelSearchDropdown";
import type { Category } from "@/types/offers";

interface CategoryModelsDialogProps {
  category: Category | null;
  onClose: () => void;
}

export const CategoryModelsDialog = ({ category, onClose }: CategoryModelsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: category?.id })
        .eq("id", modelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-models"] });
      queryClient.invalidateQueries({ queryKey: ["available-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo adicionado à categoria",
      });
    },
  });

  const removeModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: null })
        .eq("id", modelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-models"] });
      queryClient.invalidateQueries({ queryKey: ["available-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo removido da categoria",
      });
    },
  });

  return (
    <Dialog open={!!category} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Modelos: {category?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ModelSearchDropdown 
            categoryId={category?.id || ""} 
            onSelect={(modelId) => addModelMutation.mutate(modelId)}
          />
          
          <ModelList
            categoryId={category?.id || ""}
            onRemove={(modelId) => removeModelMutation.mutate(modelId)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};