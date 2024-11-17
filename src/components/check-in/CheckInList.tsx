import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Car, Camera, Clock } from "lucide-react";
import { CheckoutSession } from "./types";

const CheckInList = () => {
  const navigate = useNavigate();
  
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['check-in-reservations'],
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
      return (data || []) as unknown as CheckoutSession[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Check-in de Veículos</h1>
      
      <div className="grid gap-4">
        {reservations?.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">{reservation.selected_car.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {reservation.driver.full_name}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(reservation.pickup_date).toLocaleDateString('pt-BR')} às{' '}
                    {reservation.pickup_time}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate(`/admin/check-in/${reservation.id}`)}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Iniciar Check-in
              </Button>
            </div>
          </Card>
        ))}
        
        {(!reservations || reservations.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma reserva pendente de check-in.
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInList;