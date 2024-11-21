import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";
import OrdersWidget from "@/components/dashboard/OrdersWidget";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-up p-1">
      <div className="relative">
        <div className="max-w-2xl">
          <h1 className="text-display-sm font-display mb-2 text-gradient">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
      </div>

      <StatsPanel />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-300 ease-in-out">
        <div className="group relative p-1.5 transition-all duration-300">
          {/* Gradient blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
          
          {/* Card container with hover effect */}
          <div className="relative bg-white rounded-xl shadow-sm ring-1 ring-gray-100/50 hover:ring-primary/10 transition-all duration-300">
            <OrdersWidget />
          </div>
        </div>
        
        <div className="group relative p-1.5 transition-all duration-300">
          {/* Gradient blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-50/50 to-primary-50/50 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
          
          {/* Card container with hover effect */}
          <div className="relative bg-white rounded-xl shadow-sm ring-1 ring-gray-100/50 hover:ring-primary/10 transition-all duration-300">
            <ScheduleWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;