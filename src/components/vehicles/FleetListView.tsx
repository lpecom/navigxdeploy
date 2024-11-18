import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FleetSearchBar } from "./fleet/FleetSearchBar";
import { FleetTable } from "./fleet/FleetTable";
import type { FleetVehicle } from "./types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FleetListView = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FleetVehicle>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: fleetVehicles, refetch, isLoading, error } = useQuery({
    queryKey: ['fleet-vehicles-list', searchTerm],
    queryFn: async () => {
      console.log("Fetching fleet vehicles...");
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
        `);

      if (searchTerm) {
        query.or(`plate.ilike.%${searchTerm}%,car_model->name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching fleet vehicles:", error);
        throw error;
      }

      console.log("Raw response:", data);
      console.log("Number of vehicles fetched:", data?.length || 0);
      
      // Filter out invalid entries and log details about filtered vehicles
      const validVehicles = (data || []).filter(vehicle => {
        if (!vehicle || !vehicle.plate) {
          console.log("Filtered out invalid vehicle:", vehicle);
          return false;
        }
        return true;
      });

      console.log("Number of valid vehicles after filtering:", validVehicles.length);
      return validVehicles as FleetVehicle[];
    },
    retry: 1
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
      console.error("Error updating vehicle:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o veículo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar veículos</AlertTitle>
        <AlertDescription>
          Não foi possível carregar a lista de veículos. Por favor, tente novamente.
          {error instanceof Error ? ` Erro: ${error.message}` : ''}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <FleetSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div className="text-sm text-muted-foreground">
          Total: {fleetVehicles?.length || 0} veículos
        </div>
      </div>

      {fleetVehicles && fleetVehicles.length > 0 ? (
        <FleetTable
          vehicles={fleetVehicles}
          editingId={editingId}
          editForm={editForm}
          onEdit={handleEdit}
          onSave={handleSave}
          onEditFormChange={setEditForm}
        />
      ) : (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Nenhum veículo encontrado
            {searchTerm && " para a busca realizada"}
          </div>
        </Card>
      )}
    </div>
  );
};