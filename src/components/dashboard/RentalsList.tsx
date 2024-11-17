import { Car, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectedCar {
  name: string;
  category: string;
  price: number;
}

interface Rental {
  id: string;
  created_at: string;
  total_amount: number;
  selected_car: SelectedCar;
  driver: {
    full_name: string;
    email: string;
  } | null;
}

const RentalsList = () => {
  const { data: rentals, isLoading } = useQuery({
    queryKey: ['recent-rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          id,
          created_at,
          total_amount,
          selected_car,
          driver:driver_details(full_name, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Rental[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Aluguéis Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Aluguéis Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rentals?.map((rental) => (
            <div 
              key={rental.id} 
              className="p-4 flex items-center justify-between rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{rental.driver?.full_name}</p>
                    <Badge variant="secondary" className="font-medium">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-4 h-4" />
                      <span>{rental.selected_car.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(rental.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(rental.total_amount)}
                </p>
              </div>
            </div>
          ))}
          {(!rentals || rentals.length === 0) && (
            <div className="py-12 text-center">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nenhum aluguel ativo no momento</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalsList;