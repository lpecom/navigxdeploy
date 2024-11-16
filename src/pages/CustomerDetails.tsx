import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CustomerInfo } from "@/components/reservations/CustomerInfo";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/customers')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Detalhes do Cliente</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
            <CustomerInfo customer={customer} />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Histórico de Aluguéis</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total de aluguéis: {customer.total_rentals}
              </p>
              {customer.last_rental_date && (
                <p className="text-sm text-muted-foreground">
                  Último aluguel: {new Date(customer.last_rental_date).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Endereço</h2>
            {customer.address ? (
              <div className="space-y-2">
                <p className="text-sm">{customer.address}</p>
                <p className="text-sm">
                  {customer.city}, {customer.state} - {customer.postal_code}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;