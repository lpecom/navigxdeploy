import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeSVG } from 'qrcode.react'
import { motion } from "framer-motion"
import { QrCode } from "lucide-react"

interface PixPaymentProps {
  amount: number
  driverId: string
  onSuccess: (paymentId: string) => void
}

export const PixPayment = ({ amount, driverId, onSuccess }: PixPaymentProps) => {
  const [qrCode, setQrCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const createPixPayment = async () => {
      try {
        // Temporarily commented out Appmax integration
        /* const { data, error } = await supabase.functions.invoke('payment', {...}) */

        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setQrCode("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Recipient Name6008Sao Paulo62070503***6304E2CA")
        onSuccess("temp-pix-id-123")
      } catch (error) {
        console.error('PIX payment error:', error)
        toast({
          title: "Erro ao gerar PIX",
          description: "Não foi possível gerar o QR Code do PIX. Por favor, tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    createPixPayment()
  }, [amount, driverId, onSuccess, toast])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Gerando QR Code...</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="flex flex-col items-center space-y-6 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Pague com PIX</h3>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR Code abaixo com seu aplicativo de banco
        </p>
      </div>

      <motion.div 
        className="bg-white p-8 rounded-lg shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <QRCodeSVG value={qrCode} size={200} />
      </motion.div>

      <div className="space-y-4 w-full">
        <Button
          variant="outline"
          className="w-full h-12 gap-2 text-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-primary/10 hover:text-primary"
          onClick={() => {
            navigator.clipboard.writeText(qrCode)
            toast({
              title: "Código PIX copiado!",
              description: "Cole no seu aplicativo do banco para pagar.",
            })
          }}
        >
          Copiar código PIX
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          O QR Code expira em 30 minutos
        </p>
      </div>
    </motion.div>
  )
}