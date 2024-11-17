import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, QrCode } from "lucide-react"
import { Invoice } from "@/types/payment"
import { CreditCardForm } from "@/components/checkout/CreditCardForm"
import { PixPayment } from "@/components/checkout/PixPayment"

interface PaymentDialogProps {
  invoice: Invoice;
  onClose: () => void;
}

export const PaymentDialog = ({ invoice, onClose }: PaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'credit' | 'pix'>('credit')

  const handlePaymentSuccess = async (paymentId: string) => {
    // Update invoice status
    await supabase
      .from('invoices')
      .update({ 
        status: 'paid',
        payment_id: paymentId
      })
      .eq('id', invoice.id)

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar Fatura #{invoice.invoice_number}</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as 'credit' | 'pix')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Cartão
            </TabsTrigger>
            <TabsTrigger value="pix" className="gap-2">
              <QrCode className="h-4 w-4" />
              PIX
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credit">
            <CreditCardForm
              amount={invoice.amount}
              driverId={invoice.driver_id}
              onSuccess={handlePaymentSuccess}
            />
          </TabsContent>

          <TabsContent value="pix">
            <PixPayment
              amount={invoice.amount}
              driverId={invoice.driver_id}
              onSuccess={handlePaymentSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}