import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FleetLoadingState } from "./FleetLoadingState";
import { FleetErrorState } from "./FleetErrorState";
import { FleetVehicleProfileDialog } from "./FleetVehicleProfileDialog";
import { FleetMetricsSection } from "./sections/FleetMetricsSection";
import { FleetMainContent } from "./sections/FleetMainContent";
import { motion } from "framer-motion";
import type { FleetVehicle, VehicleStatus } from "@/types/vehicles";

export const FleetListView = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FleetVehicle>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const { data: allVehicles, isLoading, error } = useQuery({
    queryKey: ['fleet-vehicles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            id,
            name,
            year,
            image_url,
            category_id,
            brand_logo_url
          ),
          customer:customers(
            full_name,
            email,
            phone
          )
        `);
      
      if (error) throw error;
      return (data || []).filter(vehicle => vehicle && vehicle.plate) as FleetVehicle[];
    },
  });

  const filteredVehicles = allVehicles?.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.car_model?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (vehicle: FleetVehicle) => {
    setEditingId(vehicle.id);
    setEditForm(vehicle);
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fleet_vehicles')
        .update({
          current_km: editForm.current_km,
          last_revision_date: editForm.last_revision_date,
          next_revision_date: editForm.next_revision_date,
          is_available: editForm.is_available,
          status: editForm.status
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Veículo atualizado",
        description: "As informações foram salvas com sucesso.",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o veículo.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (status: VehicleStatus | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  const handleRentOut = (vehicleId: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de aluguel será implementada em breve.",
    });
  };

  if (isLoading) return <FleetLoadingState />;
  if (error) return <FleetErrorState error={error as Error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <FleetMetricsSection
        vehicles={allVehicles || []}
        statusFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />
      
      <FleetMainContent
        vehicles={filteredVehicles || []}
        editingId={editingId}
        editForm={editForm}
        searchTerm={searchTerm}
        totalVehicles={allVehicles?.length || 0}
        onEdit={handleEdit}
        onSave={handleSave}
        onEditFormChange={setEditForm}
        onRentOut={handleRentOut}
        onViewDocs={(vehicleId) => setSelectedVehicleId(vehicleId)}
        onSearchChange={setSearchTerm}
      />

      <FleetVehicleProfileDialog 
        vehicleId={selectedVehicleId || ''} 
        open={!!selectedVehicleId}
        onOpenChange={(open) => !open && setSelectedVehicleId(null)}
      />
    </motion.div>
  );
};