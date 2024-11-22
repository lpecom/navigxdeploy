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
import { Edit2, Trash2 } from "lucide-react";
import type { Plan } from "@/types/plans";

interface PlanTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
}

export const PlanTable = ({ plans, onEdit }: PlanTableProps) => {
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
          <TableHead>Tipo</TableHead>
          <TableHead>Período</TableHead>
          <TableHead>KM Incluídos</TableHead>
          <TableHead>Preço Base</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.name}</TableCell>
            <TableCell className="capitalize">{plan.type}</TableCell>
            <TableCell className="capitalize">{plan.period}</TableCell>
            <TableCell>
              {plan.included_km === 999999 ? "Ilimitado" : `${plan.included_km} km`}
            </TableCell>
            <TableCell>{formatCurrency(plan.base_price)}</TableCell>
            <TableCell>
              <Badge variant={plan.is_active ? "default" : "secondary"}>
                {plan.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(plan)}
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