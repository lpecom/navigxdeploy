import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { FleetTableRow } from "./FleetTableRow";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
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
              <TableHead className="w-[300px] font-medium text-sm text-muted-foreground">
                Veículo
              </TableHead>
              <TableHead className="w-[120px] font-medium text-sm text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-medium text-sm text-muted-foreground">
                Placa / Ano
              </TableHead>
              <TableHead className="w-[200px] font-medium text-sm text-muted-foreground">
                Motorista
              </TableHead>
              <TableHead className="w-[150px] font-medium text-sm text-muted-foreground">
                Lucro Atual
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <motion.tr
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <FleetTableRow
                  vehicle={vehicle}
                  isEditing={editingId === vehicle.id}
                  editForm={editForm}
                  onEdit={onEdit}
                  onSave={onSave}
                  onEditFormChange={onEditFormChange}
                  onRentOut={onRentOut}
                  onViewDocs={onViewDocs}
                />
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};