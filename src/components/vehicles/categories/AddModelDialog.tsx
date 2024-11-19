import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CarModel } from "@/types/vehicles";

interface AddModelDialogProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddModelDialog = ({ categoryId, open, onOpenChange }: AddModelDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableModels, isLoading } = useQuery({
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
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Modelo à Categoria</DialogTitle>
        </DialogHeader>
        {isLoading ? (
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
                      onClick={() => addModelMutation.mutate(model.id)}
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
  );
};