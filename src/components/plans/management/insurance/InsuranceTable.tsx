import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";
import type { InsuranceOptions } from "@/types/database";

interface InsuranceTableProps {
  insuranceOptions: InsuranceOptions[];
  onEdit: (insurance: InsuranceOptions) => void;
}

export const InsuranceTable = ({ insuranceOptions, onEdit }: InsuranceTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {insuranceOptions.map((insurance) => (
          <TableRow key={insurance.id}>
            <TableCell>{insurance.name}</TableCell>
            <TableCell>{insurance.description}</TableCell>
            <TableCell>{formatCurrency(insurance.price)}</TableCell>
            <TableCell>
              <Badge variant={insurance.is_active ? "default" : "secondary"}>
                {insurance.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(insurance)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};