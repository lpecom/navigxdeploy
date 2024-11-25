import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CategoryPlan {
  id: string;
  name: string;
  description?: string | null;
  base_price: number;
  period: string;
}

interface PlanTableProps {
  plans: CategoryPlan[];
  onDelete: (planId: string) => void;
}

export const PlanTable = ({ plans, onDelete }: PlanTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans?.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.name}</TableCell>
            <TableCell>{plan.description}</TableCell>
            <TableCell>R$ {plan.base_price}</TableCell>
            <TableCell>{plan.period}</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};