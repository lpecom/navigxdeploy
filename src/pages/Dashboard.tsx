import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsPanel from "@/components/dashboard/StatsPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/admin/login');
    }
  }, [navigate, session]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight mb-8">Dashboard</h1>
            <StatsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;