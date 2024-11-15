import { Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aluguéis Recentes</h2>
        </div>
        <div className="animate-pulse space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Aluguéis Recentes</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {rentals?.map((rental) => (
          <div key={rental.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{rental.driver?.full_name}</p>
                <p className="text-sm text-gray-500">{rental.selected_car.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(rental.total_amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(rental.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                Ativo
              </span>
            </div>
          </div>
        ))}
        {(!rentals || rentals.length === 0) && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum aluguel ativo no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsList;