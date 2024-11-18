import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface CategoryModelsProps {
  categoryId: string;
}

export const CategoryModels = ({ categoryId }: CategoryModelsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingModel, setIsAddingModel] = useState(false);

  const { data: categoryModels, isLoading: loadingCategoryModels } = useQuery({
    queryKey: ["category-models", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", categoryId);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const { data: availableModels, isLoading: loadingAvailableModels } = useQuery({
    queryKey: ["available-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .is("category_id", null);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const addModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: categoryId })
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

  if (loadingCategoryModels) {
    return <div>Carregando modelos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Modelos na Categoria</h3>
        <Button onClick={() => setIsAddingModel(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modelo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryModels?.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.year}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeModelMutation.mutate(model.id)}
                >
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddingModel} onOpenChange={setIsAddingModel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Modelo à Categoria</DialogTitle>
          </DialogHeader>
          {loadingAvailableModels ? (
            <div>Carregando modelos disponíveis...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableModels?.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{model.year}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          addModelMutation.mutate(model.id);
                          setIsAddingModel(false);
                        }}
                      >
                        Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};