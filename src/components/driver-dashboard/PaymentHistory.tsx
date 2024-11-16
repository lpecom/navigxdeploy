import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface PaymentHistoryProps {
  driverId: string;
}

const PaymentHistory = ({ driverId }: PaymentHistoryProps) => {
  const { data: payments } = useQuery({
    queryKey: ['driver-payments', driverId],
    queryFn: async () => {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments?.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  R$ {payment.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(payment.created_at), "PP", { locale: ptBR })}
                </p>
                {payment.description && (
                  <p className="text-sm text-gray-500">{payment.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                  {payment.status === 'completed' ? 'Pago' : 'Pendente'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {payment.payment_type === 'credit' ? 'Cartão de Crédito' : 
                   payment.payment_type === 'pix' ? 'PIX' : 'Boleto'}
                </span>
              </div>
            </div>
          ))}

          {(!payments || payments.length === 0) && (
            <p className="text-center text-gray-500">
              Nenhum pagamento encontrado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;