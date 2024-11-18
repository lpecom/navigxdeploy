import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/offers";

interface RenameDialogProps {
  category: Category | null;
  newName: string;
  onNewNameChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const RenameDialog = ({
  category,
  newName,
  onNewNameChange,
  onClose,
  onConfirm,
}: RenameDialogProps) => {
  if (!category) return null;

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Categoria</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newName}
            onChange={(e) => onNewNameChange(e.target.value)}
            placeholder="Digite o novo nome da categoria"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};