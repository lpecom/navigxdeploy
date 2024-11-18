import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Save } from "lucide-react";
import type { FleetVehicle } from "./types";

export const FleetListView = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FleetVehicle>>({});

  const { data: fleetVehicles, refetch } = useQuery({
    queryKey: ['fleet-vehicles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year
          ),
          customer:customers(
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>KM Atual</TableHead>
            <TableHead>Última Revisão</TableHead>
            <TableHead>Próxima Revisão</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fleetVehicles?.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                {vehicle.car_model?.name} ({vehicle.car_model?.year})
              </TableCell>
              <TableCell>{vehicle.plate}</TableCell>
              <TableCell>
                {editingId === vehicle.id ? (
                  <Input
                    type="number"
                    value={editForm.current_km || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      current_km: parseInt(e.target.value)
                    })}
                    className="w-24"
                  />
                ) : (
                  vehicle.current_km?.toLocaleString()
                )}
              </TableCell>
              <TableCell>
                {editingId === vehicle.id ? (
                  <Input
                    type="date"
                    value={editForm.last_revision_date || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      last_revision_date: e.target.value
                    })}
                  />
                ) : (
                  new Date(vehicle.last_revision_date).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                {editingId === vehicle.id ? (
                  <Input
                    type="date"
                    value={editForm.next_revision_date || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      next_revision_date: e.target.value
                    })}
                  />
                ) : (
                  new Date(vehicle.next_revision_date).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                {vehicle.customer?.full_name || '-'}
              </TableCell>
              <TableCell>
                {editingId === vehicle.id ? (
                  <Input
                    type="text"
                    value={editForm.status || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      status: e.target.value
                    })}
                  />
                ) : (
                  vehicle.status
                )}
              </TableCell>
              <TableCell>
                {editingId === vehicle.id ? (
                  <Button
                    size="sm"
                    onClick={() => handleSave(vehicle.id)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};