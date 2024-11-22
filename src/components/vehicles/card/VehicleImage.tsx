import { Car, Pencil } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { CarModel } from "@/types/vehicles";

interface VehicleImageProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleImage = ({ car, onEdit }: VehicleImageProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${car.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('car_models')
        .update({ image_url: publicUrl })
        .eq('id', car.id);

      if (updateError) throw updateError;

      toast({
        title: "Imagem atualizada",
        description: "A imagem do veículo foi atualizada com sucesso.",
      });

      onEdit({ ...car, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao atualizar imagem",
        description: "Ocorreu um erro ao atualizar a imagem do veículo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('car_models')
        .update({ category_id: categoryId })
        .eq('id', car.id);

      if (updateError) throw updateError;

      toast({
        title: "Categoria atualizada",
        description: "A categoria do veículo foi atualizada com sucesso.",
      });

      onEdit({ ...car, category_id: categoryId });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Erro ao atualizar categoria",
        description: "Ocorreu um erro ao atualizar a categoria do veículo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md group">
      {car.image_url ? (
        <img
          src={car.image_url}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Car className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-2">
        <label 
          className="p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
          htmlFor={`image-upload-${car.id}`}
        >
          <Pencil className="h-4 w-4 text-white" />
        </label>
        <Select
          value={car.category_id || ""}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px] bg-black/50 text-white border-0 hover:bg-black/70">
            <SelectValue placeholder="Selecionar categoria" />
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
      <input
        type="file"
        id={`image-upload-${car.id}`}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-white text-sm">Uploading...</div>
        </div>
      )}
    </div>
  );
};