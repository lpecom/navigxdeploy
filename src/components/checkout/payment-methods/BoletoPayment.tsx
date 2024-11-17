import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Receipt, Download } from "lucide-react"
import { motion } from "framer-motion"

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
        // Temporarily commented out Appmax integration
        /* const { data, error } = await supabase.functions.invoke('payment', {...}) */

        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setBoletoData({
          barcode: '34191.79001 01043.510047 91020.150008 7 99480026000',
          pdf_url: '#',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        })
        
        onSuccess("temp-boleto-id-123")
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
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Gerando boleto...</p>
      </div>
    )
  }

  if (!boletoData) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="font-medium">Erro ao gerar boleto</p>
        <p className="text-sm mt-2">Por favor, tente novamente mais tarde</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Receipt className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Boleto Bancário</h3>
        <p className="text-sm text-muted-foreground">
          Vencimento em {boletoData.due_date}
        </p>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
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
            className="hover:bg-primary/10 hover:text-primary"
          >
            Copiar
          </Button>
        </div>
        <p className="text-xs font-mono break-all bg-white p-3 rounded border">{boletoData.barcode}</p>
      </div>

      <Button
        className="w-full h-12 gap-2 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
        onClick={() => window.open(boletoData.pdf_url, '_blank')}
      >
        <Download className="h-5 w-5" />
        Baixar Boleto PDF
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        O boleto será compensado em até 3 dias úteis após o pagamento
      </p>
    </motion.div>
  )
}
