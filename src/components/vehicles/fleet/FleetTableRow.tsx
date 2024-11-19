import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { FleetVehicle } from "../types";
import { FleetVehicleProfileDialog } from "./FleetVehicleProfileDialog";

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
  onEditFormChange,
}: FleetTableRowProps) => {
  const [showProfile, setShowProfile] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Alugado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isEditing = editingId === vehicle.id;

  return (
    <>
      <TableRow>
        <TableCell>
          <div>
            <div className="font-medium">{vehicle.car_model?.name}</div>
            <div className="text-sm text-muted-foreground">{vehicle.year}</div>
          </div>
        </TableCell>
        <TableCell>{vehicle.plate}</TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="number"
              value={editForm.current_km || ''}
              onChange={(e) =>
                onEditFormChange({ ...editForm, current_km: Number(e.target.value) })
              }
              className="w-24 px-2 py-1 border rounded"
            />
          ) : (
            <span>{vehicle.current_km?.toLocaleString()} km</span>
          )}
        </TableCell>
        <TableCell>
          {format(new Date(vehicle.last_revision_date), "PP", { locale: ptBR })}
        </TableCell>
        <TableCell>
          {format(new Date(vehicle.next_revision_date), "PP", { locale: ptBR })}
        </TableCell>
        <TableCell>
          {vehicle.customer?.full_name || (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <select
              value={editForm.status || ''}
              onChange={(e) =>
                onEditFormChange({ ...editForm, status: e.target.value })
              }
              className="px-2 py-1 border rounded"
            >
              <option value="available">Disponível</option>
              <option value="maintenance">Manutenção</option>
              <option value="rented">Alugado</option>
            </select>
          ) : (
            getStatusBadge(vehicle.status || '')
          )}
        </TableCell>
        <TableCell className="text-right">
          {isEditing ? (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSave(vehicle.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(vehicle)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfile(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(vehicle)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>

      <FleetVehicleProfileDialog
        vehicleId={vehicle.id}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </>
  );
};