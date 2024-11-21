import { useSession } from '@supabase/auth-helpers-react';
import { motion } from "framer-motion";
import StatsPanel from "@/components/dashboard/StatsPanel";
import OrdersWidget from "@/components/dashboard/OrdersWidget";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

const Dashboard = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1600px] mx-auto space-y-8"
          >
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! Here's an overview of your business.
              </p>
            </div>

            <StatsPanel />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;