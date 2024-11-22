import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { FleetTableRow } from "./FleetTableRow";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/types/vehicles";

interface FleetTableProps {
  vehicles: FleetVehicle[];
  editingId?: string | null;
  editForm?: Partial<FleetVehicle>;
  onEdit?: (vehicle: FleetVehicle) => void;
  onSave?: (id: string) => Promise<void>;
  onEditFormChange?: (form: Partial<FleetVehicle>) => void;
  onRentOut?: (vehicleId: string) => void;
  onViewDocs?: (vehicleId: string) => void;
}

export const FleetTable = ({ 
  vehicles, 
  editingId,
  editForm,
  onEdit,
  onSave,
  onEditFormChange,
  onRentOut,
  onViewDocs 
}: FleetTableProps) => {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="w-[300px] font-medium">Veículo / ID</TableHead>
              <TableHead className="w-[120px] font-medium">Status</TableHead>
              <TableHead className="font-medium">Chassi e Placa</TableHead>
              <TableHead className="w-[150px] font-medium">Motorista</TableHead>
              <TableHead className="w-[120px] font-medium">Documentos</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <FleetTableRow
                key={vehicle.id}
                vehicle={vehicle}
                isEditing={editingId === vehicle.id}
                editForm={editForm}
                onEdit={onEdit}
                onSave={onSave}
                onEditFormChange={onEditFormChange}
                onRentOut={onRentOut}
                onViewDocs={onViewDocs}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};