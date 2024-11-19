import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FleetErrorStateProps {
  error: Error | null;
}

export const FleetErrorState = ({ error }: FleetErrorStateProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar veículos</AlertTitle>
      <AlertDescription>
        Não foi possível carregar a lista de veículos. Por favor, tente novamente.
        {error instanceof Error ? ` Erro: ${error.message}` : ''}
      </AlertDescription>
    </Alert>
  );
};