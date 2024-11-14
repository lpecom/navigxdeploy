import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Receipt, Download } from "lucide-react"

interface BoletoPaymentProps {
  amount: number
  driverId: string
  onSuccess: (paymentId: string) => void
}

export const BoletoPayment = ({ amount, driverId, onSuccess }: BoletoPaymentProps) => {
  const [boletoData, setBoletoData] = useState<{
    barcode: string
    pdf_url: string
    due_date: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const createBoletoPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('payment', {
          body: {
            action: 'create_payment',
            payload: {
              driver_id: driverId,
              amount,
              payment_type: 'boleto',
              description: 'Car rental payment',
              customer_name: 'Test Customer', // This should come from driver details
              customer_email: 'test@example.com',
              customer_phone: '11999999999',
              customer_cpf: '12345678909'
            }
          }
        })

        if (error) throw error

        if (!data.boleto) {
          throw new Error('Boleto data not received from payment provider')
        }

        setBoletoData({
          barcode: data.boleto.barcode,
          pdf_url: data.boleto.pdf_url,
          due_date: new Date(data.boleto.due_date).toLocaleDateString('pt-BR')
        })
        onSuccess(data.id)
      } catch (error) {
        console.error('Boleto payment error:', error)
        toast({
          title: "Erro ao gerar boleto",
          description: "Não foi possível gerar o boleto. Por favor, tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    createBoletoPayment()
  }, [amount, driverId, onSuccess, toast])

  if (isLoading) {
    return <div className="text-center py-8">Gerando boleto...</div>
  }

  if (!boletoData) {
    return <div className="text-center py-8 text-red-500">Erro ao gerar boleto</div>
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">Boleto Bancário</h3>
        <p className="text-sm text-muted-foreground">
          Vencimento em {boletoData.due_date}
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="text-sm font-medium">Código do Boleto</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(boletoData.barcode)
              toast({
                title: "Código copiado!",
                description: "Cole no seu aplicativo do banco para pagar.",
              })
            }}
          >
            Copiar
          </Button>
        </div>
        <p className="text-xs font-mono break-all">{boletoData.barcode}</p>
      </div>

      <Button
        className="w-full"
        onClick={() => window.open(boletoData.pdf_url, '_blank')}
      >
        <Download className="mr-2 h-4 w-4" />
        Baixar Boleto PDF
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        O boleto será compensado em até 3 dias úteis após o pagamento
      </p>
    </div>
  )
}