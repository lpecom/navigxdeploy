import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FleetTableRow } from "./FleetTableRow";
import type { FleetVehicle } from "../types";
import { Card } from "@/components/ui/card";

interface FleetTableProps {
  vehicles: FleetVehicle[];
  editingId: string | null;
  editForm: Partial<FleetVehicle>;
  onEdit: (vehicle: FleetVehicle) => void;
  onSave: (id: string) => void;
  onEditFormChange: (form: Partial<FleetVehicle>) => void;
}

export const FleetTable = ({
  vehicles,
  editingId,
  editForm,
  onEdit,
  onSave,
  onEditFormChange
}: FleetTableProps) => {
  return (
    <Card>
      <div className="rounded-md border-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Modelo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>KM Atual</TableHead>
              <TableHead>Última Revisão</TableHead>
              <TableHead>Próxima Revisão</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <FleetTableRow
                key={vehicle.id}
                vehicle={vehicle}
                editingId={editingId}
                editForm={editForm}
                onEdit={onEdit}
                onSave={onSave}
                onEditFormChange={onEditFormChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};