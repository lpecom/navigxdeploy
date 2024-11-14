import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface CategoryFaresProps {
  categoryId: string;
}

interface FareForm {
  plan_type: string;
  base_price: number;
  price_period: string;
  km_included: number;
  extra_km_price: number;
}

export const CategoryFares = ({ categoryId }: CategoryFaresProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingFare, setIsAddingFare] = useState(false);
  const [fareForm, setFareForm] = useState<FareForm>({
    plan_type: "",
    base_price: 0,
    price_period: "week",
    km_included: 0,
    extra_km_price: 0,
  });

  const { data: fares, isLoading } = useQuery({
    queryKey: ["category-fares", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_fares")
        .select("*")
        .eq("car_group_id", categoryId);
      
      if (error) throw error;
      return data;
    },
  });

  const addFareMutation = useMutation({
    mutationFn: async (data: FareForm) => {
      const { error } = await supabase
        .from("group_fares")
        .insert({
          ...data,
          car_group_id: categoryId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-fares", categoryId] });
      toast({
        title: "Success",
        description: "Fare added successfully",
      });
      setIsAddingFare(false);
      setFareForm({
        plan_type: "",
        base_price: 0,
        price_period: "week",
        km_included: 0,
        extra_km_price: 0,
      });
    },
  });

  const deleteFareMutation = useMutation({
    mutationFn: async (fareId: string) => {
      const { error } = await supabase
        .from("group_fares")
        .delete()
        .eq("id", fareId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-fares", categoryId] });
      toast({
        title: "Success",
        description: "Fare deleted successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading fares...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Category Fares</h3>
        <Dialog open={isAddingFare} onOpenChange={setIsAddingFare}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Fare
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fare</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFareMutation.mutate(fareForm);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Plan Type</label>
                <Input
                  value={fareForm.plan_type}
                  onChange={(e) =>
                    setFareForm({ ...fareForm, plan_type: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Base Price</label>
                <Input
                  type="number"
                  value={fareForm.base_price}
                  onChange={(e) =>
                    setFareForm({
                      ...fareForm,
                      base_price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Included KM</label>
                <Input
                  type="number"
                  value={fareForm.km_included}
                  onChange={(e) =>
                    setFareForm({
                      ...fareForm,
                      km_included: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Extra KM Price</label>
                <Input
                  type="number"
                  value={fareForm.extra_km_price}
                  onChange={(e) =>
                    setFareForm({
                      ...fareForm,
                      extra_km_price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Fare
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Type</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Included KM</TableHead>
            <TableHead>Extra KM Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fares?.map((fare) => (
            <TableRow key={fare.id}>
              <TableCell>{fare.plan_type}</TableCell>
              <TableCell>R$ {fare.base_price}</TableCell>
              <TableCell>{fare.km_included} km</TableCell>
              <TableCell>R$ {fare.extra_km_price}/km</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteFareMutation.mutate(fare.id)}
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