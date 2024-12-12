import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { createCheckoutSession } from "../CheckoutSessionHandler"

export const useCheckoutState = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()
  const navigate = useNavigate()

  // Only validate cart contents and category selection
  useEffect(() => {
    const categoryData = sessionStorage.getItem('selectedCategory')
    
    if (!categoryData) {
      toast({
        title: "Categoria não selecionada",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      })
      navigate('/')
      return
    }

    if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de prosseguir.",
        variant: "destructive",
      })
      navigate('/')
    }
  }, [cartState.items.length, cartState.checkoutSessionId, toast, navigate])

  return {
    step,
    setStep,
    customerId,
    setCustomerId,
    cartState,
    dispatch,
    toast
  }
}