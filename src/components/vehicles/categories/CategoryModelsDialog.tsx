import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, CarModel } from "@/types/offers";

interface CategoryModelsDialogProps {
  category: Category | null;
  onClose: () => void;
}

export const CategoryModelsDialog = ({ category, onClose }: CategoryModelsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categoryModels } = useQuery({
    queryKey: ["category-models", category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", category.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  const { data: availableModels } = useQuery({
    queryKey: ["available-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .is("category_id", null);
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

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

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Modelos na Categoria</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryModels?.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{model.year}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModelMutation.mutate(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Adicionar Novos Modelos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableModels?.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{model.year}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addModelMutation.mutate(model.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};