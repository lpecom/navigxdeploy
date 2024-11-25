import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface PlanFormProps {
  onSubmit: (data: any) => void;
}

export const PlanForm = ({ onSubmit }: PlanFormProps) => {
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: 0,
    price_period: "month",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(planForm);
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={planForm.name}
          onChange={(e) =>
            setPlanForm({ ...planForm, name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={planForm.description}
          onChange={(e) =>
            setPlanForm({ ...planForm, description: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Price</label>
        <Input
          type="number"
          value={planForm.price}
          onChange={(e) =>
            setPlanForm({
              ...planForm,
              price: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Plan
      </Button>
    </form>
  );
};