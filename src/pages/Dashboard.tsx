import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";
import RentalsList from "@/components/dashboard/RentalsList";

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
        <RentalsList />
      </div>
    </div>
  );
};

export default Dashboard;