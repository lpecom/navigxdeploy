import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Pencil } from "lucide-react";
import { getBrandLogo, getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface VehicleCardProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const brandLogoUrl = getBrandLogo(car.name);
  const brandName = getBrandFromModel(car.name);

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

      // Refresh the car data through the parent component
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

  const { data: fleetStats } = useQuery({
    queryKey: ['fleet-stats', car.id],
    queryFn: async () => {
      const { data: vehicles, error } = await supabase
        .from('fleet_vehicles')
        .select('status')
        .eq('car_model_id', car.id);

      if (error) {
        console.error('Error fetching fleet stats:', error);
        return null;
      }

      const statuses = vehicles?.map(v => v.status) || [];
      
      return {
        rented: statuses.filter(s => s === 'rented').length,
        available: statuses.filter(s => s === 'available').length,
        forSale: statuses.filter(s => s === 'for_sale').length,
        maintenance: statuses.filter(s => s === 'maintenance').length,
        bodyShop: statuses.filter(s => s === 'body_shop').length,
        deactivated: statuses.filter(s => s === 'deactivated').length,
        management: statuses.filter(s => s === 'management').length,
        accident: statuses.filter(s => s === 'accident').length,
        total: statuses.length
      };
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            {brandLogoUrl ? (
              <img 
                src={brandLogoUrl} 
                alt={`${brandName} brand`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Car className="w-8 h-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm text-muted-foreground font-medium">{brandName}</p>
              <h3 className="font-semibold text-lg">{car.name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {car.image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-md group">
              <img
                src={car.image_url}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <label 
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                htmlFor={`image-upload-${car.id}`}
              >
                <Pencil className="h-4 w-4 text-white" />
              </label>
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
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
              <label 
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                htmlFor={`image-upload-${car.id}`}
              >
                <Pencil className="h-4 w-4 text-white" />
              </label>
              <input
                type="file"
                id={`image-upload-${car.id}`}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Categoria</span>
              <span className="font-medium">{car.category?.name || 'Sem Categoria'}</span>
            </div>

            {fleetStats && fleetStats.total > 0 && (
              <div className="space-y-2 pt-2 border-t text-sm">
                {fleetStats.available > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Disponíveis</span>
                    <span className="font-medium text-green-600">{fleetStats.available}</span>
                  </div>
                )}
                {fleetStats.rented > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Alugados</span>
                    <span className="font-medium text-orange-600">{fleetStats.rented}</span>
                  </div>
                )}
                {fleetStats.maintenance > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Em Manutenção</span>
                    <span className="font-medium text-yellow-600">{fleetStats.maintenance}</span>
                  </div>
                )}
                {fleetStats.bodyShop > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Funilaria</span>
                    <span className="font-medium text-purple-600">{fleetStats.bodyShop}</span>
                  </div>
                )}
                {fleetStats.accident > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Acidente</span>
                    <span className="font-medium text-red-600">{fleetStats.accident}</span>
                  </div>
                )}
                {fleetStats.deactivated > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Desativados</span>
                    <span className="font-medium text-gray-600">{fleetStats.deactivated}</span>
                  </div>
                )}
                {fleetStats.management > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Diretoria</span>
                    <span className="font-medium text-blue-600">{fleetStats.management}</span>
                  </div>
                )}
                {fleetStats.forSale > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">À Venda</span>
                    <span className="font-medium text-blue-600">{fleetStats.forSale}</span>
                  </div>
                )}
              </div>
            )}

            {car.category?.name && (
              <Badge variant="secondary" className="w-fit">
                {car.category.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};