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

    const statusLower = status.toLowerCase();
    
    if (statusLower === 'available' || statusLower === 'disponível') {
      return {
        variant: 'outline' as const,
        icon: CheckCircle,
        label: statusLower === 'available' ? 'Available' : 'Disponível',
        color: 'text-green-600'
      };
    }
    
    if (statusLower.includes('maintenance') || statusLower.includes('manutenção')) {
      return {
        variant: 'warning' as const,
        icon: Wrench,
        label: statusLower.includes('maintenance') ? 'Maintenance' : 'Manutenção',
        color: 'text-yellow-600'
      };
    }
    
    if (statusLower === 'rented' || statusLower === 'alugado') {
      return {
        variant: 'secondary' as const,
        icon: Clock,
        label: statusLower === 'rented' ? 'Rented' : 'Alugado',
        color: 'text-blue-600'
      };
    }

    if (statusLower.includes('funilaria')) {
      return {
        variant: 'warning' as const,
        icon: Car,
        label: 'Funilaria',
        color: 'text-orange-600'
      };
    }

    if (statusLower.includes('desativado')) {
      return {
        variant: 'destructive' as const,
        icon: XOctagon,
        label: 'Desativado',
        color: 'text-red-600'
      };
    }

    if (statusLower.includes('diretoria')) {
      return {
        variant: 'default' as const,
        icon: Shield,
        label: 'Diretoria',
        color: 'text-purple-600'
      };
    }

    return {
      variant: 'outline' as const,
      icon: AlertTriangle,
      label: status,
      color: 'text-gray-600'
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
          <Badge 
            variant={statusInfo.variant}
            className={`flex items-center gap-1.5 px-2 py-1 ${statusInfo.color}`}
          >
            <statusInfo.icon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
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