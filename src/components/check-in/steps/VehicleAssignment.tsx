import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Car, CheckCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { GroupUpgradeDialog } from "../dialogs/GroupUpgradeDialog";
import type { CheckInReservation, SelectedCar, FleetVehicleWithRelations } from "../types";

interface VehicleAssignmentProps {
  sessionId: string;
  onComplete: () => void;
}

export const VehicleAssignment = ({ sessionId, onComplete }: VehicleAssignmentProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

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

      return {
        ...data,
        selected_car: {
          name: selectedCar.name || '',
          category: selectedCar.category || '',
          group_id: selectedCar.group_id,
          price: selectedCar.price,
          period: selectedCar.period
        } as SelectedCar
      } as CheckInReservation;
    },
  });

  const { data: availableVehicles } = useQuery({
    queryKey: ['available-vehicles', session?.selected_car?.group_id],
    enabled: !!session?.selected_car?.group_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_models(
            id,
            name,
            image_url,
            car_group:car_groups!inner(
              id,
              name,
              description,
              display_order,
              is_active,
              created_at,
              updated_at
            )
          )
        `)
        .eq('status', 'available')
        .eq('car_models.car_group.id', session?.selected_car?.group_id)
        .returns<FleetVehicleWithRelations[]>();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: availableGroups } = useQuery({
    queryKey: ['car-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_groups')
        .select(`
          *,
          group_fares(*)
        `)
        .eq('is_active', true)
        .order('display_order');
      
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

  const currentGroup = availableGroups?.find(
    group => group.id === session.selected_car.group_id
  );

  const currentPlan = currentGroup?.group_fares?.find(
    fare => fare.plan_type === session.selected_car.period
  );

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Grupo Atual: {currentGroup?.name || 'Não definido'}</span>
              <Badge variant="outline">{session.selected_car.period}</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowUpgradeDialog(true)}
              className="flex items-center gap-2"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Upgrade Disponível
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Plano: {currentPlan?.plan_type || 'Não definido'}</p>
            <p>Preço Base: R$ {currentPlan?.base_price || 0}</p>
            <p>KM Incluídos: {currentPlan?.km_included || 0} km</p>
            <p>Preço por KM extra: R$ {currentPlan?.extra_km_price || 0}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold">Veículos Disponíveis</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableVehicles?.map((vehicle) => (
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
                  {vehicle.car_models?.image_url ? (
                    <img
                      src={vehicle.car_models.image_url}
                      alt={vehicle.car_models.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">
                      {vehicle.car_models?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Placa: {vehicle.plate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Grupo: {vehicle.car_models?.car_group?.name}
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

      <GroupUpgradeDialog 
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        currentGroup={currentGroup}
        availableGroups={availableGroups || []}
        sessionId={sessionId}
      />
    </div>
  );
};