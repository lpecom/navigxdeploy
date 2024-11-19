import { Card } from "@/components/ui/card";

interface FleetEmptyStateProps {
  hasFilters: boolean;
}

export const FleetEmptyState = ({ hasFilters }: FleetEmptyStateProps) => {
  return (
    <Card className="p-6">
      <div className="text-center text-muted-foreground">
        Nenhum veículo encontrado
        {hasFilters && " para os filtros selecionados"}
      </div>
    </Card>
  );
};