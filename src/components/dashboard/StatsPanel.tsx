import { DollarSign, Users, Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatsPanel = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total revenue from completed payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        throw paymentsError;
      }

      // Get count of active rentals
      const { count: activeRentals, error: rentalsError } = await supabase
        .from('fleet_vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'alugado');

      if (rentalsError) {
        console.error('Error fetching rentals:', rentalsError);
        throw rentalsError;
      }

      // Get count of vehicles in maintenance
      const { count: maintenanceCount, error: maintenanceError } = await supabase
        .from('fleet_vehicles')
        .select('*', { count: 'exact', head: true })
        .ilike('status', '%manutenção%');

      if (maintenanceError) {
        console.error('Error fetching maintenance vehicles:', maintenanceError);
        throw maintenanceError;
      }

      // Get count of vehicles in body shop (funilaria)
      const { count: bodyShopCount, error: bodyShopError } = await supabase
        .from('fleet_vehicles')
        .select('*', { count: 'exact', head: true })
        .ilike('status', '%funilaria%');

      if (bodyShopError) {
        console.error('Error fetching body shop vehicles:', bodyShopError);
        throw bodyShopError;
      }

      // Get count of deactivated vehicles
      const { count: deactivatedCount, error: deactivatedError } = await supabase
        .from('fleet_vehicles')
        .select('*', { count: 'exact', head: true })
        .ilike('status', '%desativado%');

      if (deactivatedError) {
        console.error('Error fetching deactivated vehicles:', deactivatedError);
        throw deactivatedError;
      }

      // Get count of management vehicles (diretoria)
      const { count: managementCount, error: managementError } = await supabase
        .from('fleet_vehicles')
        .select('*', { count: 'exact', head: true })
        .ilike('status', '%diretoria%');

      if (managementError) {
        console.error('Error fetching management vehicles:', managementError);
        throw managementError;
      }

      const totalRevenue = payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;

      return {
        revenue: totalRevenue,
        activeRentals: activeRentals || 0,
        maintenanceCount: maintenanceCount || 0,
        bodyShopCount: bodyShopCount || 0,
        deactivatedCount: deactivatedCount || 0,
        managementCount: managementCount || 0,
      };
    },
  });

  const statsConfig = [
    {
      label: "Receita Total",
      value: `R$ ${stats?.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` || "R$ 0,00",
      change: "+12%",
      icon: DollarSign,
    },
    {
      label: "Aluguéis Ativos",
      value: stats?.activeRentals.toString() || "0",
      change: "+4%",
      icon: Car,
    },
    {
      label: "Em Manutenção",
      value: stats?.maintenanceCount.toString() || "0",
      change: "+7%",
      icon: Users,
    },
    {
      label: "Funilaria",
      value: stats?.bodyShopCount.toString() || "0",
      change: "+2%",
      icon: Car,
    },
    {
      label: "Desativados",
      value: stats?.deactivatedCount.toString() || "0",
      change: "-5%",
      icon: Car,
    },
    {
      label: "Diretoria",
      value: stats?.managementCount.toString() || "0",
      change: "0%",
      icon: Car,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsConfig.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-lg border border-gray-200 animate-fade-in hover:border-primary/20 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{stat.value}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-success">
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;