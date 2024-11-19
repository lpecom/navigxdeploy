import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Wrench, AlertCircle, CheckCircle } from "lucide-react";
import { QuickStatsCard } from "./QuickStatsCard";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { MonthlyActivityChart } from "./MonthlyActivityChart";
import { MaintenanceList } from "./MaintenanceList";

export const FleetOverview = () => {
  const { data: fleetStats } = useQuery({
    queryKey: ['fleet-stats'],
    queryFn: async () => {
      const { data: vehicles, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year
          ),
          customer:customers(
            full_name
          )
        `);

      if (error) throw error;

      const stats = {
        total: vehicles?.length || 0,
        available: vehicles?.filter(v => v.status?.toLowerCase() === 'available').length || 0,
        maintenance: vehicles?.filter(v => v.status?.toLowerCase()?.includes('maintenance')).length || 0,
        rented: vehicles?.filter(v => v.status?.toLowerCase() === 'rented').length || 0,
        accident: vehicles?.filter(v => v.status?.toLowerCase() === 'accident').length || 0,
        inactive: vehicles?.filter(v => v.status?.toLowerCase() === 'desativado').length || 0,
        maintenanceData: vehicles?.filter(v => v.next_revision_date)
          .map(v => ({
            plate: v.plate,
            date: new Date(v.next_revision_date).toLocaleDateString(),
            model: v.car_model?.name,
            customer: v.customer?.full_name
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5) || [],
        statusDistribution: [
          { name: 'Disponível', value: vehicles?.filter(v => v.status?.toLowerCase() === 'available').length || 0 },
          { name: 'Manutenção', value: vehicles?.filter(v => v.status?.toLowerCase()?.includes('maintenance')).length || 0 },
          { name: 'Alugado', value: vehicles?.filter(v => v.status?.toLowerCase() === 'rented').length || 0 },
          { name: 'Funilaria', value: vehicles?.filter(v => v.status?.toLowerCase()?.includes('funilaria')).length || 0 },
          { name: 'Acidente', value: vehicles?.filter(v => v.status?.toLowerCase() === 'accident').length || 0 },
          { name: 'Diretoria', value: vehicles?.filter(v => v.status?.toLowerCase()?.includes('diretoria')).length || 0 },
          { name: 'Inativo', value: vehicles?.filter(v => v.status?.toLowerCase() === 'desativado').length || 0 },
        ],
        monthlyStats: [
          { name: 'Jan', rentals: 4, maintenance: 2 },
          { name: 'Fev', rentals: 6, maintenance: 1 },
          { name: 'Mar', rentals: 8, maintenance: 3 },
          { name: 'Abr', rentals: 10, maintenance: 2 },
          { name: 'Mai', rentals: 7, maintenance: 4 },
          { name: 'Jun', rentals: 9, maintenance: 1 },
        ],
      };

      return stats;
    },
  });

  if (!fleetStats) {
    return null;
  }

  const quickStats = [
    {
      title: "Total da Frota",
      value: fleetStats.total,
      description: "Veículos cadastrados",
      icon: Car,
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Disponíveis",
      value: fleetStats.available,
      description: "Prontos para locação",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Em Manutenção",
      value: fleetStats.maintenance,
      description: "Em serviço",
      icon: Wrench,
      gradient: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Acidentes",
      value: fleetStats.accident,
      description: "Ocorrências registradas",
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-red-50 to-red-100",
      iconColor: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <QuickStatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusDistributionChart data={fleetStats.statusDistribution} />
        <MonthlyActivityChart data={fleetStats.monthlyStats} />
      </div>

      <MaintenanceList data={fleetStats.maintenanceData} />
    </div>
  );
};