import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/dashboard/Header";
import StatsPanel from "@/components/dashboard/StatsPanel";
import RentalsList from "@/components/dashboard/RentalsList";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin/login");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível verificar sua autenticação",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="max-w-7xl mx-auto space-y-6">
        <StatsPanel />
        <RentalsList />
      </div>
    </main>
  );
};

export default Index;