import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FleetSearchBar } from "./fleet/FleetSearchBar";
import { FleetTable } from "./fleet/FleetTable";
import { FleetMetrics } from "./fleet/FleetMetrics";
import type { FleetVehicle } from "./types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FleetListView = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FleetVehicle>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: fleetVehicles, refetch, isLoading, error } = useQuery({
    queryKey: ['fleet-vehicles-list', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
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

      // Apply search filter
      if (searchTerm) {
        query = query.or(`plate.ilike.%${searchTerm}%,car_models(name).ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter) {
        switch (statusFilter) {
          case 'available':
            query = query.or('status.ilike.%available%,status.ilike.%disponível%');
            break;
          case 'maintenance':
            query = query.or('status.ilike.%maintenance%,status.ilike.%manutenção%');
            break;
          case 'rented':
            query = query.or('status.ilike.%rented%,status.ilike.%alugado%');
            break;
          case 'funilaria':
            query = query.ilike('status', '%funilaria%');
            break;
          case 'desativado':
            query = query.ilike('status', '%desativado%');
            break;
          case 'diretoria':
            query = query.ilike('status', '%diretoria%');
            break;
          default:
            break;
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || [])
        .filter(vehicle => vehicle && vehicle.plate) as FleetVehicle[];
    },
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

  const handleFilterChange = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
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
    <div className="space-y-6">
      <FleetMetrics 
        vehicles={fleetVehicles || []} 
        onFilterChange={handleFilterChange}
        activeFilter={statusFilter}
      />
      
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
            {(searchTerm || statusFilter) && " para os filtros selecionados"}
          </div>
        </Card>
      )}
    </div>
  );
};