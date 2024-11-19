import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "./ImageUpload";
import type { CarModel } from "@/types/vehicles";

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCar: CarModel | null;
  setEditingCar: (car: CarModel | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  imageOnly?: boolean;
}

export const EditVehicleDialog = ({
  open,
  onOpenChange,
  editingCar,
  setEditingCar,
  onSubmit,
  imageOnly = false,
}: EditVehicleDialogProps) => {
  const updateCarField = (field: keyof CarModel, value: string) => {
    if (!editingCar) return;
    setEditingCar({
      ...editingCar,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {imageOnly ? 'Editar Imagem' : editingCar ? 'Editar Veículo' : 'Adicionar Veículo'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {!imageOnly && (
            <>
              <div className="space-y-2">
                <label htmlFor="name">Nome do Veículo</label>
                <Input
                  id="name"
                  value={editingCar?.name || ""}
                  onChange={(e) => updateCarField("name", e.target.value)}
                  placeholder="Ex: Honda Civic"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description">Descrição</label>
                <Textarea
                  id="description"
                  value={editingCar?.description || ""}
                  onChange={(e) => updateCarField("description", e.target.value)}
                  placeholder="Descreva o veículo..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="year">Ano do Veículo</label>
                <Input
                  id="year"
                  value={editingCar?.year || ""}
                  onChange={(e) => updateCarField("year", e.target.value)}
                  placeholder="Ex: 2024"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label>Imagem do Veículo</label>
            <ImageUpload
              currentImage={editingCar?.image_url}
              onImageChange={(url) => updateCarField("image_url", url)}
            />
          </div>

          <Button type="submit" className="w-full">
            {imageOnly ? 'Salvar Imagem' : editingCar ? 'Salvar Alterações' : 'Adicionar Veículo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};