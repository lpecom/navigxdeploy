import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, ChevronRight } from "lucide-react";
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
              {vehicle.car_model?.name} {vehicle.year}
            </p>
            <p className="text-sm text-gray-500">{vehicle.id.slice(0, 8)}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={vehicle.status === 'available' ? 'success' : 'secondary'}
          className="font-medium"
        >
          {vehicle.status === 'available' ? 'Active' : vehicle.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">{vehicle.chassis_number}</p>
          <p className="text-sm text-gray-500">{vehicle.plate}</p>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant={vehicle.customer ? "outline" : "secondary"}
          size="sm"
          onClick={() => onRentOut(vehicle.id)}
          className="w-24"
        >
          Rent out
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDocs(vehicle.id)}
          className="w-full flex items-center justify-center gap-2"
        >
          <span className="sr-only">View documents</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
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
            <DropdownMenuItem>Edit details</DropdownMenuItem>
            <DropdownMenuItem>Maintenance history</DropdownMenuItem>
            <DropdownMenuItem>Delete vehicle</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
