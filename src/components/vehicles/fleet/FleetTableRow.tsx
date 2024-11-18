import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit2, Save } from "lucide-react";
import type { FleetVehicle } from "../types";

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
  return (
    <TableRow>
      <TableCell>
        {vehicle.car_model?.name} ({vehicle.car_model?.year})
      </TableCell>
      <TableCell>{vehicle.plate}</TableCell>
      <TableCell>
        {editingId === vehicle.id ? (
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
          vehicle.current_km?.toLocaleString()
        )}
      </TableCell>
      <TableCell>
        {editingId === vehicle.id ? (
          <Input
            type="date"
            value={editForm.last_revision_date || ''}
            onChange={(e) => onEditFormChange({
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
            onChange={(e) => onEditFormChange({
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
            onChange={(e) => onEditFormChange({
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