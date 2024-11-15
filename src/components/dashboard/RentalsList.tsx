import { Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RentalsList = () => {
  const { data: rentals, isLoading } = useQuery({
    queryKey: ['recent-rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(full_name, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
      ))}
    </div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Aluguéis Recentes</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {rentals?.map((rental) => (
          <div key={rental.id} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{rental.driver?.full_name}</p>
                <p className="text-sm text-gray-500">{rental.selected_car.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(rental.created_at).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500">
                  R$ {Number(rental.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                Ativo
              </span>
            </div>
          </div>
        ))}
        {(!rentals || rentals.length === 0) && (
          <div className="p-8 text-center text-gray-500">
            Nenhum aluguel ativo no momento
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsList;