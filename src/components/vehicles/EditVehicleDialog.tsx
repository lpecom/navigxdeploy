import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CarModel } from "./types";

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCar: CarModel | null;
  setEditingCar: (car: CarModel | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditVehicleDialog = ({
  open,
  onOpenChange,
  editingCar,
  setEditingCar,
  onSubmit,
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
          <DialogTitle>Edit Car</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={editingCar?.name || ""}
              onChange={(e) => updateCarField("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image">Image URL</label>
            <Input
              id="image"
              value={editingCar?.image_url || ""}
              onChange={(e) => updateCarField("image_url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="year">Year</label>
            <Input
              id="year"
              value={editingCar?.year || ""}
              onChange={(e) => updateCarField("year", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Input
              id="description"
              value={editingCar?.description || ""}
              onChange={(e) => updateCarField("description", e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};