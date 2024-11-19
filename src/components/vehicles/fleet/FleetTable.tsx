import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { FleetTableRow } from "./FleetTableRow";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/types/vehicles";

interface FleetTableProps {
  vehicles: FleetVehicle[];
  onRentOut: (vehicleId: string) => void;
  onViewDocs: (vehicleId: string) => void;
}

export const FleetTable = ({ vehicles, onRentOut, onViewDocs }: FleetTableProps) => {
  return (
    <Card className="border-0">
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-gray-50 border-0">
              <TableHead className="w-[300px] font-medium">Vehicle / ID</TableHead>
              <TableHead className="w-[120px] font-medium">Status</TableHead>
              <TableHead className="font-medium">VIN & License plate</TableHead>
              <TableHead className="w-[150px] font-medium">Driver</TableHead>
              <TableHead className="w-[120px] font-medium">Vehicle docs</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <FleetTableRow
                key={vehicle.id}
                vehicle={vehicle}
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