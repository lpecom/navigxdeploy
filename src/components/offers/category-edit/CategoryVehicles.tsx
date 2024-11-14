import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CarModel } from "@/types/vehicles";

interface CategoryVehiclesProps {
  categoryId: string;
}

export const CategoryVehicles = ({ categoryId }: CategoryVehiclesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const { data: categoryVehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ["category-vehicles", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", categoryId);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const { data: availableVehicles, isLoading: loadingAvailable } = useQuery({
    queryKey: ["available-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .is("car_group_id", null);
      
      if (error) throw error;
      return data;
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: categoryId })
        .eq("id", vehicleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-vehicles", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["available-vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle added to category",
      });
      setIsAddingVehicle(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    },
  });

  const removeVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: null })
        .eq("id", vehicleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-vehicles", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["available-vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle removed from category",
      });
    },
  });

  if (loadingVehicles) {
    return <div>Loading vehicles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Category Vehicles</h3>
        <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vehicle to Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {loadingAvailable ? (
                <div>Loading available vehicles...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableVehicles?.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.name}</TableCell>
                        <TableCell>{vehicle.category}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => addVehicleMutation.mutate(vehicle.id)}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Engine</TableHead>
            <TableHead>Transmission</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryVehicles?.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.engine_size}</TableCell>
              <TableCell>{vehicle.transmission}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeVehicleMutation.mutate(vehicle.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};