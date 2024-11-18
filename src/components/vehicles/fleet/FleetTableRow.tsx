import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Wrench,
  Car,
  XOctagon,
  Shield
} from "lucide-react";
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
  const getStatusInfo = (status: string | null) => {
    if (!status) return {
      variant: 'outline' as const,
      icon: AlertTriangle,
      label: 'N/A'
    };

    status = status.toLowerCase();
    
    // Available status
    if (status === 'available' || status === 'disponível') return {
      variant: 'outline' as const,
      icon: CheckCircle,
      label: status === 'available' ? 'Available' : 'Disponível'
    };
    
    // Maintenance status
    if (status.includes('maintenance') || status.includes('manutenção')) return {
      variant: 'destructive' as const,
      icon: Wrench,
      label: status.includes('maintenance') ? 'Maintenance' : 'Manutenção'
    };
    
    // Rented status
    if (status === 'rented' || status === 'alugado') return {
      variant: 'secondary' as const,
      icon: Clock,
      label: status === 'rented' ? 'Rented' : 'Alugado'
    };

    // Body shop status (Funilaria)
    if (status.includes('funilaria')) return {
      variant: 'warning' as const,
      icon: Car,
      label: 'Funilaria'
    };

    // Disabled status (Desativado)
    if (status.includes('desativado')) return {
      variant: 'destructive' as const,
      icon: XOctagon,
      label: 'Desativado'
    };

    // Management status (Diretoria)
    if (status.includes('diretoria')) return {
      variant: 'default' as const,
      icon: Shield,
      label: 'Diretoria'
    };

    // Default fallback
    return {
      variant: 'outline' as const,
      icon: AlertTriangle,
      label: status
    };
  };

  if (!vehicle.plate || !vehicle.car_model) {
    return null;
  }

  const statusInfo = getStatusInfo(vehicle.status);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        {vehicle.car_model?.name} ({vehicle.car_model?.year || 'N/A'})
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
          vehicle.current_km?.toLocaleString() || 'N/A'
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
          vehicle.last_revision_date ? new Date(vehicle.last_revision_date).toLocaleDateString() : 'N/A'
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
          vehicle.next_revision_date ? new Date(vehicle.next_revision_date).toLocaleDateString() : 'N/A'
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
          <div className="flex items-center gap-2">
            <Badge 
              variant={statusInfo.variant} 
              className="flex items-center gap-1.5 px-2 py-1"
            >
              <statusInfo.icon className="w-3 h-3" />
              <span>{statusInfo.label}</span>
            </Badge>
          </div>
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