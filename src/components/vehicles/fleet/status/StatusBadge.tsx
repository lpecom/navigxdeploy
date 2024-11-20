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
    color: 'text-gray-600 bg-gray-50'
  };

  const statusLower = status.toLowerCase();
  
  if (statusLower === 'available' || statusLower === 'disponível') {
    return {
      variant: 'outline' as const,
      icon: CheckCircle,
      label: statusLower === 'available' ? 'Available' : 'Disponível',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    };
  }
  
  if (statusLower.includes('maintenance') || statusLower.includes('manutenção')) {
    return {
      variant: 'warning' as const,
      icon: Wrench,
      label: statusLower.includes('maintenance') ? 'Maintenance' : 'Manutenção',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    };
  }
  
  if (statusLower === 'rented' || statusLower === 'alugado') {
    return {
      variant: 'secondary' as const,
      icon: Clock,
      label: statusLower === 'rented' ? 'Rented' : 'Alugado',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    };
  }

  if (statusLower.includes('funilaria') || statusLower === 'body_shop') {
    return {
      variant: 'warning' as const,
      icon: Car,
      label: 'Funilaria',
      color: 'text-orange-700 bg-orange-50 border-orange-200'
    };
  }

  if (statusLower.includes('desativado') || statusLower === 'deactivated') {
    return {
      variant: 'destructive' as const,
      icon: XOctagon,
      label: 'Desativado',
      color: 'text-red-700 bg-red-50 border-red-200'
    };
  }

  if (statusLower.includes('diretoria') || statusLower === 'management') {
    return {
      variant: 'default' as const,
      icon: Shield,
      label: 'Diretoria',
      color: 'text-purple-700 bg-purple-50 border-purple-200'
    };
  }

  if (statusLower === 'accident') {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
      label: 'Acidente',
      color: 'text-red-700 bg-red-50 border-red-200'
    };
  }

  return {
    variant: 'outline' as const,
    icon: AlertTriangle,
    label: status,
    color: 'text-gray-700 bg-gray-50 border-gray-200'
  };
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusInfo = getStatusInfo(status);
  
  return (
    <Badge 
      variant="outline"
      className={`flex items-center gap-1.5 px-2.5 py-1 font-medium transition-colors ${statusInfo.color}`}
    >
      <statusInfo.icon className="w-3.5 h-3.5" />
      <span>{statusInfo.label}</span>
    </Badge>
  );
};