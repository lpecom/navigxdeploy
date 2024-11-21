import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Car, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { CheckInReservation, SelectedCar, Optional } from "../types";

interface VehicleAssignmentProps {
  sessionId: string;
  onComplete: () => void;
}

export const VehicleAssignment = ({ sessionId, onComplete }: VehicleAssignmentProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      
      const selectedCar = data.selected_car as Record<string, any>;
      const optionals = Array.isArray(data.selected_optionals) 
        ? data.selected_optionals.map(opt => ({
            name: (opt as Record<string, any>).name || '',
            price: Number((opt as Record<string, any>).price) || 0
          }))
        : [];

      return {
        ...data,
        selected_car: {
          name: selectedCar.name || '',
          category: selectedCar.category || '',
          group_id: selectedCar.group_id,
          price: selectedCar.price,
          period: selectedCar.period
        } as SelectedCar,
        selected_optionals: optionals
      } as CheckInReservation;
    },
  });

  const { data: availableVehicles } = useQuery({
    queryKey: ['available-vehicles', session?.selected_car?.category],
    enabled: !!session?.selected_car?.category,
    queryFn: async () => {
      // First get the category ID for the selected category name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', session.selected_car.category)
        .single();
      
      if (categoryError) throw categoryError;
      
      if (!categoryData?.id) {
        throw new Error('Category not found');
      }

      // Then query vehicles with the correct category ID
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(*)
        `)
        .eq('status', 'available')
        .eq('car_model.category_id', categoryData.id);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAssignVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      setIsAssigning(true);

      const { error: updateError } = await supabase
        .from('checkout_sessions')
        .update({
          assigned_vehicle_id: selectedVehicle,
          check_in_status: 'completed'
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      const { error: vehicleError } = await supabase
        .from('fleet_vehicles')
        .update({ status: 'rented' })
        .eq('id', selectedVehicle);

      if (vehicleError) throw vehicleError;

      toast.success('Veículo atribuído com sucesso');
      onComplete();
    } catch (error) {
      console.error('Error assigning vehicle:', error);
      toast.error('Erro ao atribuir veículo');
    } finally {
      setIsAssigning(false);
    }
  };

  if (!session || !availableVehicles) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Atribuição de Veículo</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableVehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                selectedVehicle === vehicle.id
                  ? 'ring-2 ring-primary'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {vehicle.car_model?.image_url ? (
                    <img
                      src={vehicle.car_model.image_url}
                      alt={vehicle.car_model.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">
                      {vehicle.car_model?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Placa: {vehicle.plate}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {vehicle.current_km.toLocaleString()} km
                    </Badge>
                    {selectedVehicle === vehicle.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleAssignVehicle}
          disabled={!selectedVehicle || isAssigning}
          size="lg"
        >
          {isAssigning ? "Atribuindo..." : "Concluir Check-in"}
        </Button>
      </div>
    </div>
  );
};
