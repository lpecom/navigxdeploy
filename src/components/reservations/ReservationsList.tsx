import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@/types/reservation";
import { ReservationCard } from "./ReservationCard";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReservationsList = () => {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
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
        reservationNumber: session.reservation_number,
        customerName: session.driver?.full_name || 'Customer not identified',
        email: session.driver?.email || '',
        cpf: session.driver?.cpf || '',
        phone: session.driver?.phone || '',
        address: session.driver?.address || '',
        pickupDate: session.pickup_date || session.created_at,
        pickupTime: session.pickup_time || '',
        status: session.status,
        paymentStatus: 'pending',
        customerStatus: 'new',
        riskScore: 25,
        documentsSubmitted: false,
        createdAt: session.created_at,
        carCategory: session.selected_car?.category || 'Economy',
        leadSource: 'form',
        weeklyFare: session.total_amount,
        optionals: session.selected_optionals || [],
        kilometersPerWeek: 1000,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="queue">In Queue</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {reservations?.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
            />
          ))}
        </TabsContent>

        {/* Add other TabsContent components for other statuses */}
      </Tabs>
    </div>
  );
};

export default ReservationsList;
