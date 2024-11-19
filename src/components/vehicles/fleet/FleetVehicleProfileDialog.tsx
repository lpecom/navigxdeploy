import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FleetVehicleProfile } from "./FleetVehicleProfile";

interface FleetVehicleProfileDialogProps {
  vehicleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FleetVehicleProfileDialog = ({
  vehicleId,
  open,
  onOpenChange,
}: FleetVehicleProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <FleetVehicleProfile vehicleId={vehicleId} />
      </DialogContent>
    </Dialog>
  );
};