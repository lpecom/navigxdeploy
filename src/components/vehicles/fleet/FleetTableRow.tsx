import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit2, Save } from "lucide-react";
import type { FleetVehicle } from "../types";
import { StatusBadge } from "./status/StatusBadge";
import { CustomerSelect } from "./customer/CustomerSelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FleetTableRowProps {
  vehicle: FleetVehicle;
  editingId: string | null;
  editForm: Partial<FleetVehicle>;
  onEdit: (vehicle: FleetVehicle) => void;
  onSave: (id: string) => void;
  onEditFormChange: (form: Partial<FleetVehicle>) => void;
}

export const FleetTableRow = ({ 
  vehicle, 
  editingId, 
  editForm, 
  onEdit, 
  onSave,
  onEditFormChange 
}: FleetTableRowProps) => {
  const { toast } = useToast();
  const isEditing = editingId === vehicle.id;

  const handleStatusChange = async (status: string) => {
    if (status.toLowerCase() === 'rented' && !editForm.customer_id) {
      toast({
        title: "Customer Required",
        description: "Please select a customer when marking a vehicle as rented.",
        variant: "destructive",
      });
      return;
    }

    // Update customer status if vehicle is being marked as rented
    if (status.toLowerCase() === 'rented' && editForm.customer_id) {
      const { error: customerError } = await supabase
        .from('customers')
        .update({ status: 'active_rental' })
        .eq('id', editForm.customer_id);

      if (customerError) {
        toast({
          title: "Error",
          description: "Failed to update customer status.",
          variant: "destructive",
        });
        return;
      }
    }

    onEditFormChange({
      ...editForm,
      status,
      is_available: status.toLowerCase() !== 'rented'
    });
  };

  if (!vehicle.plate || !vehicle.car_model) {
    return null;
  }

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        {vehicle.car_model?.name} ({vehicle.car_model?.year || 'N/A'})
      </TableCell>
      <TableCell>{vehicle.plate}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editForm.current_km || ''}
            onChange={(e) => onEditFormChange({
              ...editForm,
              current_km: parseInt(e.target.value)
            })}
            className="w-24"
          />
        ) : (
          vehicle.current_km?.toLocaleString() || 'N/A'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editForm.last_revision_date || ''}
            onChange={(e) => onEditFormChange({
              ...editForm,
              last_revision_date: e.target.value
            })}
          />
        ) : (
          vehicle.last_revision_date ? new Date(vehicle.last_revision_date).toLocaleDateString() : 'N/A'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editForm.next_revision_date || ''}
            onChange={(e) => onEditFormChange({
              ...editForm,
              next_revision_date: e.target.value
            })}
          />
        ) : (
          vehicle.next_revision_date ? new Date(vehicle.next_revision_date).toLocaleDateString() : 'N/A'
        )}
      </TableCell>
      <TableCell>
        {isEditing && editForm.status?.toLowerCase() === 'rented' ? (
          <CustomerSelect
            value={editForm.customer_id || ''}
            onChange={(value) => onEditFormChange({
              ...editForm,
              customer_id: value
            })}
          />
        ) : (
          vehicle.customer?.full_name || '-'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            value={editForm.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        ) : (
          <StatusBadge status={vehicle.status} />
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Button
            size="sm"
            onClick={() => onSave(vehicle.id)}
          >
            <Save className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(vehicle)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};