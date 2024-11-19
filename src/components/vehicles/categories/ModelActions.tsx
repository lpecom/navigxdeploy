import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface ModelActionsProps {
  model: CarModel;
  onEdit: (model: CarModel) => void;
  onImageEdit: (model: CarModel) => void;
}

export const ModelActions = ({ model, onEdit, onImageEdit }: ModelActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(model)}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Editar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onImageEdit(model)}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        Imagem
      </Button>
    </div>
  );
};