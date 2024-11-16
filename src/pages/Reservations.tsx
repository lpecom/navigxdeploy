import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReservationsList from "@/components/reservations/ReservationsList";

interface ReservationsProps {
  filter: 'pending' | 'pickup-today' | 'upcoming' | 'active';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">
        {filter === 'pending' && 'Reservas Pendentes'}
        {filter === 'pickup-today' && 'Retiradas de Hoje'}
        {filter === 'upcoming' && 'Próximas Semanas'}
        {filter === 'active' && 'Reservas Ativas'}
      </h1>
      <ReservationsList filter={filter} />
    </div>
  );
};

export default Reservations;