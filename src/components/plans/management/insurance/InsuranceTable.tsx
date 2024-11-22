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
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
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
                {insurance.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(insurance)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};