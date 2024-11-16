import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "@/components/driver-dashboard/VehicleInfo";
import MaintenanceHistory from "@/components/driver-dashboard/MaintenanceHistory";
import PaymentHistory from "@/components/driver-dashboard/PaymentHistory";
import SupportTickets from "@/components/driver-dashboard/SupportTickets";
import DriverHeader from "@/components/driver-dashboard/DriverHeader";
import { DriverSidebar } from "@/components/driver-dashboard/DriverSidebar";
import { Car, Wrench, CreditCard, MessageSquare } from "lucide-react";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      <DriverSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex flex-col">
        <DriverHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Painel do Motorista</h1>
              <p className="text-gray-500 mt-1">Gerencie seu veículo e acompanhe suas informações</p>
            </div>

            <Tabs defaultValue="vehicle" className="space-y-8">
              <TabsList className="inline-flex h-14 items-center justify-center rounded-lg bg-white p-1 shadow-sm border border-gray-200">
                <TabsTrigger 
                  value="vehicle" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm h-11 gap-2"
                >
                  <Car className="w-4 h-4" />
                  Meu Veículo
                </TabsTrigger>
                <TabsTrigger 
                  value="maintenance"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm h-11 gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Manutenção
                </TabsTrigger>
                <TabsTrigger 
                  value="payments"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm h-11 gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pagamentos
                </TabsTrigger>
                <TabsTrigger 
                  value="support"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm h-11 gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Suporte
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="vehicle" className="space-y-6 animate-fade-in">
                  <VehicleInfo driverId={driverId} />
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-6 animate-fade-in">
                  <MaintenanceHistory driverId={driverId} />
                </TabsContent>

                <TabsContent value="payments" className="space-y-6 animate-fade-in">
                  <PaymentHistory driverId={driverId} />
                </TabsContent>

                <TabsContent value="support" className="space-y-6 animate-fade-in">
                  <SupportTickets driverId={driverId} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;