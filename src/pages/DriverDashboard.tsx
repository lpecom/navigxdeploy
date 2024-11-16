import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VehicleInfo from "@/components/driver-dashboard/VehicleInfo";
import MaintenanceHistory from "@/components/driver-dashboard/MaintenanceHistory";
import PaymentHistory from "@/components/driver-dashboard/PaymentHistory";
import SupportTickets from "@/components/driver-dashboard/SupportTickets";
import DriverHeader from "@/components/driver-dashboard/DriverHeader";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [driverId, setDriverId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Get driver details - now handling multiple results
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

      // Use the most recent driver record if multiple exist
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
      <DriverHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vehicle" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicle">Meu Veículo</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle" className="space-y-4">
            <VehicleInfo driverId={driverId} />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <MaintenanceHistory driverId={driverId} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentHistory driverId={driverId} />
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SupportTickets driverId={driverId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DriverDashboard;