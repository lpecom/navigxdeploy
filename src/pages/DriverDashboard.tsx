import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "@/components/driver-dashboard/VehicleInfo";
import MaintenanceHistory from "@/components/driver-dashboard/MaintenanceHistory";
import PaymentHistory from "@/components/driver-dashboard/PaymentHistory";
import SupportTickets from "@/components/driver-dashboard/SupportTickets";
import DriverHeader from "@/components/driver-dashboard/DriverHeader";
import { DriverSidebar } from "@/components/driver-dashboard/DriverSidebar";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: drivers, error } = await supabase
        .from('driver_details')
        .select('id')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive",
        });
        return;
      }

      if (drivers && drivers.length > 0) {
        setDriverId(drivers[0].id);
      } else {
        toast({
          title: "Erro",
          description: "Perfil de motorista não encontrado.",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (!driverId) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DriverSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex-1 flex flex-col">
        <DriverHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Content will be rendered here based on the current route */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
