import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import type { Accessory } from "@/pages/Accessories";
import { useToast } from "@/components/ui/use-toast";

interface AccessoryListProps {
  accessories: Accessory[];
  onEdit: (accessory: Accessory) => void;
  onRefetch: () => void;
}

// Default Unsplash images for optionals
const defaultThumbnails = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
];

export const AccessoryList = ({ accessories, onEdit, onRefetch }: AccessoryListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', deletingId);

      if (error) throw error;

      toast({
        title: "Opcional excluído",
        description: "O opcional foi excluído com sucesso.",
      });
      
      onRefetch();
    } catch (error) {
      console.error('Error deleting accessory:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o opcional.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessories.map((accessory) => (
            <TableRow key={accessory.id}>
              <TableCell>
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage 
                    src={accessory.thumbnail_url || defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)]} 
                    alt={accessory.name}
                  />
                  <AvatarFallback>{accessory.name[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{accessory.name}</TableCell>
              <TableCell>{accessory.description}</TableCell>
              <TableCell>R$ {accessory.price.toFixed(2)}</TableCell>
              <TableCell>
                {accessory.price_period === 'per_rental' ? 'Por Aluguel' : 'Por Dia'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(accessory)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(accessory.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este opcional? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};