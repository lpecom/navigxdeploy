import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, QrCode } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Invoice } from "@/types/payment"
import { PaymentDialog } from "./PaymentDialog"

interface InvoicesListProps {
  driverId: string;
}

export const InvoicesList = ({ driverId }: InvoicesListProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('driver_id', driverId)
        .order('due_date', { ascending: false })

      if (error) throw error
      return data as Invoice[]
    }
  })

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500'
      case 'overdue':
        return 'bg-red-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {invoices?.map((invoice) => (
        <Card key={invoice.id} className="hover:bg-accent/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    Fatura #{invoice.invoice_number}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {invoice.description}
                </p>
              </div>

              <div className="text-right">
                <div className="font-bold">
                  R$ {invoice.amount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vence em {format(new Date(invoice.due_date), "dd 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                {invoice.status === 'paid' ? 'Pago' : 
                 invoice.status === 'overdue' ? 'Vencido' : 
                 invoice.status === 'pending' ? 'Pendente' : 'Cancelado'}
              </Badge>

              {invoice.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <QrCode className="h-4 w-4" />
                    PIX
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedInvoice && (
        <PaymentDialog
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  )
}