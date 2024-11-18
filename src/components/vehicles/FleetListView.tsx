import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FleetSearchBar } from "./fleet/FleetSearchBar";
import { FleetTable } from "./fleet/FleetTable";
import type { FleetVehicle } from "./types";

export const FleetListView = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FleetVehicle>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: fleetVehicles, refetch } = useQuery({
    queryKey: ['fleet-vehicles-list', searchTerm],
    queryFn: async () => {
      const query = supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year,
            image_url
          ),
          customer:customers(
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query.or(`plate.ilike.%${searchTerm}%,car_model->name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FleetVehicle[];
    }
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
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o veículo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FleetSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <FleetTable
        vehicles={fleetVehicles || []}
        editingId={editingId}
        editForm={editForm}
        onEdit={handleEdit}
        onSave={handleSave}
        onEditFormChange={setEditForm}
      />
    </div>
  );
};