import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FleetSearchBar } from "./FleetSearchBar";
import { FleetTable } from "./FleetTable";
import { FleetMetrics } from "./FleetMetrics";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FleetListView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['fleet-vehicles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year,
            image_url
          ),
          customer:customers(
            full_name,
            email,
            phone
          )
        `);
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.car_model?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRentOut = (vehicleId: string) => {
    // Implement rent out logic
    toast({
      title: "Coming soon",
      description: "Rent out functionality will be implemented soon.",
    });
  };

  const handleViewDocs = (vehicleId: string) => {
    // Implement view docs logic
    toast({
      title: "Coming soon",
      description: "Document viewer will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading vehicles</AlertTitle>
        <AlertDescription>
          Unable to load the fleet list. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <FleetMetrics 
        vehicles={vehicles || []} 
        onFilterChange={setStatusFilter}
        activeFilter={statusFilter}
      />
      
      <div className="flex items-center justify-between gap-4">
        <FleetSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {filteredVehicles && filteredVehicles.length > 0 ? (
        <FleetTable
          vehicles={filteredVehicles}
          onRentOut={handleRentOut}
          onViewDocs={handleViewDocs}
        />
      ) : (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            No vehicles found
            {(searchTerm || statusFilter) && " for the selected filters"}
          </div>
        </Card>
      )}
    </div>
  );
};