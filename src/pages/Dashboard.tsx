import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <StatsPanel />
    </div>
  );
};

export default Dashboard;