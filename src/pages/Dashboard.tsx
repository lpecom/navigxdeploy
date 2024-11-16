import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-8">Dashboard</h1>
      <StatsPanel />
    </>
  );
};

export default Dashboard;