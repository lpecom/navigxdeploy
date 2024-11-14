import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";

interface CarModel {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  year: string | null;
  description: string | null;
  optionals: Record<string, boolean>;
}

export const VehicleList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCar, setEditingCar] = useState<CarModel | null>(null);

  const { data: cars, isLoading } = useQuery({
    queryKey: ["car-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*, categories(name)");
      
      if (error) throw error;
      return data;
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async (car: CarModel) => {
      const { data, error } = await supabase
        .from("car_models")
        .update({
          name: car.name,
          image_url: car.image_url,
          year: car.year,
          description: car.description,
          optionals: car.optionals,
        })
        .eq("id", car.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-models"] });
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
      setIsEditing(false);
      setEditingCar(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update car",
        variant: "destructive",
      });
    },
  });

  const handleEditCar = (car: CarModel) => {
    setEditingCar(car);
    setIsEditing(true);
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    
    updateCarMutation.mutate(editingCar);
  };

  if (isLoading) return <div>Loading cars...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car) => (
          <Card key={car.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">{car.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditCar(car)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {car.image_url && (
                <img
                  src={car.image_url}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Year: {car.year}</p>
                <p className="text-sm">{car.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(car.optionals || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className={`text-sm px-2 py-1 rounded ${
                        value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {key.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCar} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={editingCar?.name || ""}
                onChange={(e) =>
                  setEditingCar(
                    (prev) => prev && { ...prev, name: e.target.value }
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="image">Image URL</label>
              <Input
                id="image"
                value={editingCar?.image_url || ""}
                onChange={(e) =>
                  setEditingCar(
                    (prev) => prev && { ...prev, image_url: e.target.value }
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="year">Year</label>
              <Input
                id="year"
                value={editingCar?.year || ""}
                onChange={(e) =>
                  setEditingCar(
                    (prev) => prev && { ...prev, year: e.target.value }
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                value={editingCar?.description || ""}
                onChange={(e) =>
                  setEditingCar(
                    (prev) => prev && { ...prev, description: e.target.value }
                  )
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};