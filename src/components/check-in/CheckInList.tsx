import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Car } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CheckoutSession, SelectedCar, Optional } from "./types";

const CheckInList = () => {
  const navigate = useNavigate();
  
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['check-in-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .eq('status', 'approved')
        .order('pickup_date', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our type
      return (data || []).map(session => {
        const selectedCar = session.selected_car as Record<string, any>;
        const optionals = Array.isArray(session.selected_optionals) 
          ? session.selected_optionals.map(opt => ({
              name: (opt as Record<string, any>).name || '',
              price: Number((opt as Record<string, any>).price) || 0
            }))
          : [];

        return {
          ...session,
          selected_car: {
            name: selectedCar.name || '',
            category: selectedCar.category || '',
            group_id: selectedCar.group_id,
            price: selectedCar.price,
            period: selectedCar.period
          } as SelectedCar,
          selected_optionals: optionals
        } as CheckoutSession;
      });
    },
  });

  const handleStartCheckIn = (id: string) => {
    navigate(`/admin/check-in/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Check-in de Veículos</h1>
      
      <div className="grid gap-4">
        {sessions?.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">
                      {session.driver?.full_name}
                    </h3>
                    <Badge variant="outline">
                      #{session.reservation_number}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(session.pickup_date), "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    
                    {session.pickup_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.pickup_time}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      <span>{session.selected_car.name}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartCheckIn(session.id)}
                  className="ml-4"
                >
                  Iniciar Check-in
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {sessions?.length === 0 && (
          <Card className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum check-in pendente
            </h3>
            <p className="text-gray-500">
              Não há reservas aprovadas aguardando check-in no momento.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckInList;