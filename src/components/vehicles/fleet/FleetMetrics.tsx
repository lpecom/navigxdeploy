import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle, Clock, Wrench, XOctagon, Shield, AlertCircle } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicles";
import { cn } from "@/lib/utils";

interface FleetMetricsProps {
  vehicles: FleetVehicle[];
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
}

export const FleetMetrics = ({ vehicles, onFilterChange, activeFilter }: FleetMetricsProps) => {
  const metrics = [
    {
      title: "Total da Frota",
      value: vehicles.length,
      icon: Car,
      description: "Veículos cadastrados",
      color: "text-primary",
      bgColor: "bg-primary/10",
      filterValue: null
    },
    {
      title: "Disponíveis",
      value: vehicles.filter(v => v.status?.toLowerCase() === 'available').length,
      icon: CheckCircle,
      description: "Prontos para uso",
      color: "text-green-600",
      bgColor: "bg-green-100",
      filterValue: "available"
    },
    {
      title: "Alugados",
      value: vehicles.filter(v => v.status?.toLowerCase() === 'rented').length,
      icon: Clock,
      description: "Em uso",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      filterValue: "rented"
    },
    {
      title: "Manutenção",
      value: vehicles.filter(v => v.status?.toLowerCase() === 'maintenance').length,
      icon: Wrench,
      description: "Em serviço",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      filterValue: "maintenance"
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.title} 
          className={cn(
            "transition-all duration-200 hover:shadow-md cursor-pointer border-none bg-gradient-to-br from-white to-gray-50/80",
            activeFilter === metric.filterValue && "ring-2 ring-primary/20 shadow-lg"
          )}
          onClick={() => onFilterChange(metric.filterValue)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
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