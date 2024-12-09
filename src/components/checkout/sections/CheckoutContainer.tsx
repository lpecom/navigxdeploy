import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useSession } from "@supabase/auth-helpers-react"
import { useNavigate } from "react-router-dom"
import { createCheckoutSession } from "../CheckoutSessionHandler"

export const useCheckoutState = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()
  const session = useSession()
  const navigate = useNavigate()

  // Check for existing session and driver details
  useEffect(() => {
    const checkSession = async () => {
      if (session?.user) {
        const { data: driverDetails, error } = await supabase
          .from('driver_details')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching driver details:', error)
          return
        }

        if (driverDetails) {
          setCustomerId(driverDetails.id)
          // Only create checkout session if we have items and no existing session
          if (cartState.items.length > 0 && !cartState.checkoutSessionId) {
            try {
              await createCheckoutSession({
                driverId: driverDetails.id,
                cartItems: cartState.items,
                totalAmount: cartState.total,
                onSuccess: (sessionId) => {
                  dispatch({ type: 'SET_CHECKOUT_SESSION', payload: sessionId })
                }
              })
            } catch (error) {
              console.error('Error creating checkout session:', error)
            }
          }
        }
      }
    }

    checkSession()
  }, [session, cartState.items, cartState.total, cartState.checkoutSessionId, dispatch])

  // Prevent empty cart access and handle category validation
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