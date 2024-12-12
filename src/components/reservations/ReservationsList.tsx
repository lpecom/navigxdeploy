import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@/types/reservation";
import { ReservationCard } from "./ReservationCard";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReservationsListProps {
  filter?: 'pending' | 'pickup' | 'checkin';
  status?: 'pending_approval' | 'approved' | 'rejected';
  selectedDate?: Date;
}

const ReservationsList = ({ filter, status, selectedDate }: ReservationsListProps) => {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', filter, status, selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(
            id,
            full_name,
            email,
            cpf,
            phone,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((session): Reservation => ({
        id: session.id,
        reservationNumber: String(session.reservation_number),
        customerName: session.driver?.full_name || 'Cliente não identificado',
        email: session.driver?.email || '',
        cpf: session.driver?.cpf || '',
        phone: session.driver?.phone || '',
        address: session.driver?.address || '',
        pickupDate: session.pickup_date || session.created_at,
        pickupTime: session.pickup_time || '',
        status: session.status as Reservation['status'],
        paymentStatus: 'pending',
        customerStatus: 'new',
        riskScore: 25,
        documentsSubmitted: false,
        createdAt: session.created_at,
        carCategory: (session.selected_car as { category: string })?.category || 'Economy',
        leadSource: 'form',
        weeklyFare: session.total_amount,
        optionals: (session.selected_optionals as { name: string; pricePerWeek: number }[]) || [],
        kilometersPerWeek: 1000,
        planType: (session.selected_car as { plan_type?: string })?.plan_type,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="queue">In Queue</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reservations?.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsList;