import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { QRCodeSVG } from 'qrcode.react'

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
        const { data, error } = await supabase.functions.invoke('payment', {
          body: {
            action: 'create_payment',
            payload: {
              driver_id: driverId,
              amount,
              payment_type: 'pix',
              description: 'Car rental payment',
              customer_name: 'Test Customer', // This should come from driver details
              customer_email: 'test@example.com',
              customer_phone: '11999999999',
              customer_cpf: '12345678909'
            }
          }
        })

        if (error) throw error

        if (!data.pix?.qr_code) {
          throw new Error('QR Code not received from payment provider')
        }

        setQrCode(data.pix.qr_code)
        onSuccess(data.id)
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
    return <div className="text-center py-8">Gerando QR Code...</div>
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">Pague com PIX</h3>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR Code abaixo com seu aplicativo de banco
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG value={qrCode} size={200} />
      </div>

      <div className="space-y-2 w-full">
        <Button
          variant="outline"
          className="w-full"
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
    </div>
  )
}