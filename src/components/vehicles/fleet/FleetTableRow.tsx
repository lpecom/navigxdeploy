import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status/StatusBadge";
import { MoreVertical, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FleetVehicle } from "@/types/vehicles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FleetTableRowProps {
  vehicle: FleetVehicle;
  isEditing?: boolean;
  editForm?: Partial<FleetVehicle>;
  onEdit?: (vehicle: FleetVehicle) => void;
  onSave?: (id: string) => Promise<void>;
  onEditFormChange?: (form: Partial<FleetVehicle>) => void;
  onRentOut?: (vehicleId: string) => void;
  onViewDocs?: (vehicleId: string) => void;
}

export const FleetTableRow = ({ 
  vehicle,
  isEditing,
  editForm,
  onEdit,
  onSave,
  onEditFormChange,
  onRentOut,
  onViewDocs 
}: FleetTableRowProps) => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    if (vehicle.customer_id) {
      navigate(`/admin/customers/${vehicle.customer_id}`);
    }
  };

  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          {vehicle.car_model?.image_url ? (
            <img
              src={vehicle.car_model.image_url}
              alt={vehicle.car_model?.name}
              className="w-16 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-lg" />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {vehicle.car_model?.name}
            </p>
            <p className="text-sm text-gray-500">
              {vehicle.car_model?.brand_logo_url && (
                <img 
                  src={vehicle.car_model.brand_logo_url} 
                  alt="Brand logo" 
                  className="h-4 w-auto inline mr-2"
                />
              )}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={vehicle.status} />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">{vehicle.plate}</p>
          <p className="text-sm text-gray-500">{vehicle.year}</p>
        </div>
      </TableCell>
      <TableCell>
        {vehicle.customer ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCustomerClick}
            className="text-left hover:bg-gray-100"
          >
            <div>
              <p className="font-medium text-sm">{vehicle.customer.full_name}</p>
              <p className="text-xs text-gray-500">{vehicle.customer.phone}</p>
            </div>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRentOut?.(vehicle.id)}
            className="text-xs"
          >
            Disponível para locação
          </Button>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p className="font-medium text-emerald-600">
            R$ {(Math.random() * 10000).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Últimos 30 dias
          </p>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(vehicle)}>
              Editar detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDocs?.(vehicle.id)}>
              Ver documentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}>
              Ver perfil completo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};