import { useSession } from '@supabase/auth-helpers-react';
import StatsPanel from "@/components/dashboard/StatsPanel";
import OrdersWidget from "@/components/dashboard/OrdersWidget";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";
import Lottie from "lottie-react";
import analyticsAnimation from "@/assets/animations/analytics.json";
import loadingAnimation from "@/assets/animations/loading.json";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32">
          <Lottie 
            animationData={loadingAnimation} 
            loop={true}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-display-sm font-display mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Welcome back! Here's an overview of your business.
            </p>
          </div>
          <div className="w-32 h-32 opacity-75">
            <Lottie 
              animationData={analyticsAnimation} 
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      <StatsPanel />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-300 ease-in-out">
        <div className="relative p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl opacity-50 blur-xl" />
          <div className="relative bg-white rounded-lg shadow-sm">
            <OrdersWidget />
          </div>
        </div>
        
        <div className="relative p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl opacity-50 blur-xl" />
          <div className="relative bg-white rounded-lg shadow-sm">
            <ScheduleWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;