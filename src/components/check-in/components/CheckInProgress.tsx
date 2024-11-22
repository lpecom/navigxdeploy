import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CheckInProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const CheckInProgress = ({ currentStep, totalSteps }: CheckInProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Progresso do Check-in</h4>
        <Badge variant="secondary">
          Etapa {currentStep} de {totalSteps}
        </Badge>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};