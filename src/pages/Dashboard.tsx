import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";
import RentalsList from "@/components/dashboard/RentalsList";
import OrdersWidget from "@/components/dashboard/OrdersWidget";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo de volta! Aqui está um resumo do seu negócio.</p>
      </div>

      <div className="grid gap-8">
        <StatsPanel />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OrdersWidget />
          <ScheduleWidget />
        </div>
        
        <RentalsList />
      </div>
    </div>
  );
};

export default Dashboard;