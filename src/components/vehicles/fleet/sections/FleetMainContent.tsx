import { FleetTable } from "../FleetTable";
import { FleetHeader } from "../FleetHeader";
import { FleetEmptyState } from "../FleetEmptyState";
import type { FleetVehicle } from "@/types/vehicles";

interface FleetMainContentProps {
  vehicles: FleetVehicle[];
  editingId: string | null;
  editForm: Partial<FleetVehicle>;
  searchTerm: string;
  totalVehicles: number;
  onEdit: (vehicle: FleetVehicle) => void;
  onSave: (id: string) => Promise<void>;
  onEditFormChange: (form: Partial<FleetVehicle>) => void;
  onRentOut: (vehicleId: string) => void;
  onViewDocs: (vehicleId: string) => void;
  onSearchChange: (value: string) => void;
}

export const FleetMainContent = ({
  vehicles,
  editingId,
  editForm,
  searchTerm,
  totalVehicles,
  onEdit,
  onSave,
  onEditFormChange,
  onRentOut,
  onViewDocs,
  onSearchChange,
}: FleetMainContentProps) => {
  return (
    <>
      <FleetHeader
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        totalFiltered={vehicles.length}
        totalVehicles={totalVehicles}
      />

      {vehicles.length > 0 ? (
        <FleetTable
          vehicles={vehicles}
          editingId={editingId}
          editForm={editForm}
          onEdit={onEdit}
          onSave={onSave}
          onEditFormChange={onEditFormChange}
          onRentOut={onRentOut}
          onViewDocs={onViewDocs}
        />
      ) : (
        <FleetEmptyState hasFilters={!!searchTerm} />
      )}
    </>
  );
};