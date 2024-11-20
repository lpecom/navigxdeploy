import { AlertTriangle, Car, CheckCircle, Clock, Shield, Wrench, XOctagon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string | null;
}

export const getStatusInfo = (status: string | null) => {
  if (!status) return {
    variant: 'outline' as const,
    icon: AlertTriangle,
    label: 'N/A',
    color: 'text-gray-600'
  };

  const statusLower = status.toLowerCase();
  
  if (statusLower === 'available' || statusLower === 'disponível') {
    return {
      variant: 'outline' as const,
      icon: CheckCircle,
      label: statusLower === 'available' ? 'Available' : 'Disponível',
      color: 'text-green-600'
    };
  }
  
  if (statusLower.includes('maintenance') || statusLower.includes('manutenção')) {
    return {
      variant: 'warning' as const,
      icon: Wrench,
      label: statusLower.includes('maintenance') ? 'Maintenance' : 'Manutenção',
      color: 'text-yellow-600'
    };
  }
  
  if (statusLower === 'rented' || statusLower === 'alugado') {
    return {
      variant: 'secondary' as const,
      icon: Clock,
      label: statusLower === 'rented' ? 'Rented' : 'Alugado',
      color: 'text-blue-600'
    };
  }

  if (statusLower.includes('funilaria') || statusLower === 'body_shop') {
    return {
      variant: 'warning' as const,
      icon: Car,
      label: 'Funilaria',
      color: 'text-orange-600'
    };
  }

  if (statusLower.includes('desativado') || statusLower === 'deactivated') {
    return {
      variant: 'destructive' as const,
      icon: XOctagon,
      label: 'Desativado',
      color: 'text-red-600'
    };
  }

  if (statusLower.includes('diretoria') || statusLower === 'management') {
    return {
      variant: 'default' as const,
      icon: Shield,
      label: 'Diretoria',
      color: 'text-purple-600'
    };
  }

  if (statusLower === 'accident') {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
      label: 'Accident',
      color: 'text-red-600'
    };
  }

  return {
    variant: 'outline' as const,
    icon: AlertTriangle,
    label: status,
    color: 'text-gray-600'
  };
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusInfo = getStatusInfo(status);
  
  return (
    <Badge 
      variant={statusInfo.variant}
      className={`flex items-center gap-1.5 px-2 py-1 ${statusInfo.color}`}
    >
      <statusInfo.icon className="w-3 h-3" />
      <span>{statusInfo.label}</span>
    </Badge>
  );
};