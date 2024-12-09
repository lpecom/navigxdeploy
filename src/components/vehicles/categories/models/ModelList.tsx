import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface ModelListProps {
  categoryId: string;
  onRemove: (modelId: string) => void;
}

export const ModelList = ({ categoryId, onRemove }: ModelListProps) => {
  const { data: models, isLoading } = useQuery({
    queryKey: ["category-models", categoryId],
    queryFn: async () => {
      // Only fetch if we have a valid categoryId
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");
      
      if (error) throw error;
      return data as CarModel[];
    },
    enabled: Boolean(categoryId), // Only run query if categoryId exists
  });

  if (isLoading) {
    return <div>Carregando modelos...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Motor</TableHead>
            <TableHead>Transmissão</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.year}</TableCell>
              <TableCell>{model.engine_size}</TableCell>
              <TableCell>{model.transmission}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(model.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!models?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum modelo nesta categoria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};