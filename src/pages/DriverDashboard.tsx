import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DriverHeader from "@/components/driver-dashboard/DriverHeader";
import { DriverSidebar } from "@/components/driver-dashboard/DriverSidebar";
import { DriverVehicle } from "@/components/driver-dashboard/DriverVehicle";
import { DriverReservations } from "@/components/driver-dashboard/DriverReservations";
import { DriverFinancial } from "@/components/driver-dashboard/DriverFinancial";
import { DriverPromotions } from "@/components/driver-dashboard/DriverPromotions";
import { DriverOverview } from "@/components/driver-dashboard/DriverOverview";

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
    <div className="min-h-screen bg-gray-50">
      <DriverSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <DriverHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<DriverOverview driverId={driverId} />} />
              <Route path="vehicle" element={<DriverVehicle driverId={driverId} />} />
              <Route path="reservations" element={<DriverReservations driverId={driverId} />} />
              <Route path="financial" element={<DriverFinancial driverId={driverId} />} />
              <Route path="promotions" element={<DriverPromotions driverId={driverId} />} />
              <Route path="*" element={<Navigate to="/driver" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;