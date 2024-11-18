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
        .from('checkout_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (rentalsError) {
        console.error('Error fetching rentals:', rentalsError);
        throw rentalsError;
      }

      // Get total number of customers
      const { count: totalCustomers, error: customersError } = await supabase
        .from('driver_details')
        .select('*', { count: 'exact', head: true });

      if (customersError) {
        console.error('Error fetching customers:', customersError);
        throw customersError;
      }

      const totalRevenue = payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;

      return {
        revenue: totalRevenue,
        activeRentals: activeRentals || 0,
        customers: totalCustomers || 0,
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
      label: "Total de Clientes",
      value: stats?.customers.toString() || "0",
      change: "+7%",
      icon: Users,
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