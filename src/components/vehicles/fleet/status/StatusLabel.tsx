import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Flag, AlertOctagon, Info } from "lucide-react"
import type { VehicleStatus } from "@/types/vehicles"

interface StatusLabelProps {
  status: VehicleStatus | null | undefined;
  size?: "sm" | "default" | "lg";
}

export const StatusLabel = ({ status, size = "default" }: StatusLabelProps) => {
  if (!status) return null;

  const getStatusConfig = (status: VehicleStatus) => {
    switch (status) {
      case "available":
        return {
          label: "Disponível",
          icon: Check,
          variant: "success" as const,
          className: "bg-green-100 text-green-800"
        };
      case "rented":
        return {
          label: "Alugado",
          icon: Info,
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800"
        };
      case "maintenance":
        return {
          label: "Em Manutenção",
          icon: AlertCircle,
          variant: "warning" as const,
          className: "bg-yellow-100 text-yellow-800"
        };
      case "body_shop":
        return {
          label: "Funilaria",
          icon: AlertOctagon,
          variant: "warning" as const,
          className: "bg-orange-100 text-orange-800"
        };
      case "deactivated":
        return {
          label: "Desativado",
          icon: AlertOctagon,
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800"
        };
      case "management":
        return {
          label: "Diretoria",
          icon: Flag,
          variant: "default" as const,
          className: "bg-purple-100 text-purple-800"
        };
      default:
        return {
          label: status,
          icon: Info,
          variant: "default" as const,
          className: "bg-gray-100 text-gray-800"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <Badge 
      variant="outline"
      className={`flex items-center gap-1.5 font-medium ${config.className} ${sizeClasses[size]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
};