import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { FleetVehicle } from "../types";
import { cn } from "@/lib/utils";

interface FleetMetricsProps {
  vehicles: FleetVehicle[];
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
}

export const FleetMetrics = ({ vehicles, onFilterChange, activeFilter }: FleetMetricsProps) => {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => 
    v.status?.toLowerCase() === 'available' || 
    v.status?.toLowerCase() === 'disponível'
  ).length;
  const maintenanceVehicles = vehicles.filter(v => 
    v.status?.toLowerCase().includes('maintenance') || 
    v.status?.toLowerCase().includes('manutenção')
  ).length;
  const rentedVehicles = vehicles.filter(v => 
    v.status?.toLowerCase() === 'rented' || 
    v.status?.toLowerCase() === 'alugado'
  ).length;

  const metrics = [
    {
      title: "Total da Frota",
      value: totalVehicles,
      icon: Car,
      description: "Veículos cadastrados",
      color: "text-primary",
      bgColor: "bg-primary/10",
      filterValue: null
    },
    {
      title: "Disponíveis",
      value: availableVehicles,
      icon: CheckCircle,
      description: "Prontos para uso",
      color: "text-green-600",
      bgColor: "bg-green-100",
      filterValue: "available"
    },
    {
      title: "Em Manutenção",
      value: maintenanceVehicles,
      icon: AlertTriangle,
      description: "Em serviço",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      filterValue: "maintenance"
    },
    {
      title: "Alugados",
      value: rentedVehicles,
      icon: Clock,
      description: "Em uso",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      filterValue: "rented"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.title} 
          className={cn(
            "hover:border-primary/20 transition-colors cursor-pointer",
            activeFilter === metric.filterValue && "border-primary"
          )}
          onClick={() => onFilterChange(metric.filterValue)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};