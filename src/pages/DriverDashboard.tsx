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
import { DriverNotifications } from "@/components/driver-dashboard/DriverNotifications";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Find driver by email
        const { data: driver, error: driverError } = await supabase
          .from('driver_details')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (driverError || !driver) {
          toast({
            title: "Acesso Negado",
            description: "Perfil de motorista não encontrado.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        setDriverId(driver.id);
      } catch (error: any) {
        console.error("Auth error:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao verificar sua autenticação",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <Route path="notifications" element={<DriverNotifications />} />
              <Route path="*" element={<Navigate to="/driver" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;