import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReservationsList from "@/components/reservations/ReservationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ReservationFilter } from "@/types/reservation";

interface ReservationsProps {
  filter: ReservationFilter;
}

const Reservations = ({ filter }: ReservationsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return;
        }
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível verificar sua autenticação",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filter === 'pending') {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Reservas Pendentes</h1>
          <ReservationsList filter="pending" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Retiradas</h1>
        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="this-week">Esta Semana</TabsTrigger>
            <TabsTrigger value="next-week">Próxima Semana</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <ReservationsList filter="today" />
          </TabsContent>
          <TabsContent value="this-week">
            <ReservationsList filter="this-week" />
          </TabsContent>
          <TabsContent value="next-week">
            <ReservationsList filter="next-week" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Reservations;