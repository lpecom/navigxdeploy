import { useState } from "react"
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface StripePaymentFormProps {
  onSuccess: (paymentId: string) => void
}

export const StripePaymentForm = ({ onSuccess }: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required"
      })

      if (error) {
        toast({
          title: "Erro no pagamento",
          description: error.message || "Ocorreu um erro ao processar seu pagamento.",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi processado com sucesso.",
        })
        onSuccess(paymentIntent.id)
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
      >
        {isProcessing ? "Processando..." : "Pagar"}
      </Button>
    </form>
  )
}