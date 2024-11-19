import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CarModel } from "@/types/vehicles";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

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
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ url: string; thumbnail: string; title: string }>>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const updateCarField = (field: keyof CarModel, value: string) => {
    if (!editingCar) return;
    setEditingCar({
      ...editingCar,
      [field]: value,
    });
  };

  const searchImages = async () => {
    if (!editingCar?.name) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('crawl-car-images', {
        body: { modelName: editingCar.name }
      });

      if (error) throw error;
      if (data.images) {
        setSearchResults(data.images);
        setShowImagePicker(true);
      }
    } catch (error) {
      console.error('Error searching images:', error);
      toast({
        title: "Error",
        description: "Failed to search for images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectImage = async (url: string) => {
    updateCarField("image_url", url);
    setShowImagePicker(false);
    toast({
      title: "Success",
      description: "Image selected successfully",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCar ? 'Editar Veículo' : 'Adicionar Veículo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
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
              <label htmlFor="category">Categoria do Veículo</label>
              <Select
                value={editingCar?.category_id || ""}
                onValueChange={(value) => updateCarField("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label>Imagem do Veículo</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={searchImages}
                  disabled={isSearching || !editingCar?.name}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar Imagens
                </Button>
              </div>
              <ImageUpload
                currentImage={editingCar?.image_url}
                onImageChange={(url) => updateCarField("image_url", url)}
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

            <Button type="submit" className="w-full">
              {editingCar ? 'Salvar Alterações' : 'Adicionar Veículo'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={showImagePicker} onOpenChange={setShowImagePicker}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Selecionar Imagem</SheetTitle>
            <SheetDescription>
              Escolha uma das imagens encontradas para o modelo {editingCar?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {searchResults.map((image, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={() => selectImage(image.url)}
              >
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-40 object-cover rounded-lg transition-all duration-200 group-hover:opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="secondary" size="sm">
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};