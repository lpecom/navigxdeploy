import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export const VehicleListHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Button className="bg-black hover:bg-gray-800">
        <Plus className="w-4 h-4 mr-2" />
        Add New Product
      </Button>
      <div className="flex items-center gap-4">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};