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
    <>
      <TableCell>
        <div className="flex items-center gap-3">
          {vehicle.car_model?.image_url ? (
            <div className="relative w-24 h-16 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={vehicle.car_model.image_url}
                  alt={vehicle.car_model?.name}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 p-1"
                />
                {vehicle.car_model?.brand_logo_url && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full shadow-sm p-1">
                    <img 
                      src={vehicle.car_model.brand_logo_url} 
                      alt="Brand logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-24 h-16 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {vehicle.car_model?.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {vehicle.branch}
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
            className="text-left hover:bg-gray-100 group w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="font-medium text-sm">{vehicle.customer.full_name}</p>
                <p className="text-xs text-gray-500">{vehicle.customer.phone}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRentOut?.(vehicle.id)}
            className="text-xs w-full bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
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
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit?.(vehicle)} className="cursor-pointer">
              Editar detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDocs?.(vehicle.id)} className="cursor-pointer">
              Ver documentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)} className="cursor-pointer">
              Ver perfil completo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </>
  );
};