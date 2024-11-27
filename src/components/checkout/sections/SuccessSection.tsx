import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/CartContext"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"

export const SuccessSection = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { state: cartState } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleKYCStart = async () => {
    if (isProcessing || !cartState.checkoutSessionId) return
    setIsProcessing(true)

    try {
      // Update the checkout session status to pending_approval
      const { error: sessionError } = await supabase
        .from('checkout_sessions')
        .update({ 
          status: 'pending_approval',
        })
        .eq('id', cartState.checkoutSessionId)

      if (sessionError) {
        console.error('Session update error:', sessionError)
        throw new Error('Não foi possível atualizar o status da reserva')
      }

      // Only create notification if we have a customerId
      if (cartState.customerId) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            driver_id: cartState.customerId,
            title: 'Nova Reserva',
            message: 'Uma nova reserva está aguardando aprovação.',
            type: 'reservation'
          })
        
        if (notificationError) {
          console.error('Notification error:', notificationError)
          throw new Error('Não foi possível criar a notificação')
        }
      }

      toast({
        title: "Reserva enviada para aprovação",
        description: "Você será redirecionado para verificação de documentos após a aprovação.",
      })

      // Redirect to a pending approval page
      navigate('/driver/reservations')
    } catch (error: any) {
      console.error('Error processing reservation:', error)
      toast({
        title: "Erro ao processar reserva",
        description: error.message || "Ocorreu um erro ao enviar sua reserva. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reserva Pré-Aprovada!</h2>
        <p className="text-gray-600 mb-8">
          Sua reserva foi recebida com sucesso e está em análise. Após a aprovação, você poderá prosseguir com a verificação de documentos.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleKYCStart}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Enviar para Aprovação"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Voltar para Home
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}