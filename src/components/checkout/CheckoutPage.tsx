import { CheckoutLayout } from "./ui/CheckoutLayout"
import { EmptyCartMessage } from "./ui/EmptyCartMessage"
import { CheckoutContent } from "./sections/CheckoutContent"
import { useCheckoutState } from "./sections/CheckoutContainer"

export const CheckoutPage = () => {
  const {
    step,
    setStep,
    customerId,
    setCustomerId,
    cartState,
    dispatch,
    toast
  } = useCheckoutState()

  // Only show empty cart message if there are no items and user hasn't started checkout
  if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
    return (
      <CheckoutLayout>
        <EmptyCartMessage />
      </CheckoutLayout>
    )
  }

  return (
    <CheckoutLayout>
      <CheckoutContent
        step={step}
        setStep={setStep}
        customerId={customerId}
        setCustomerId={setCustomerId}
        cartState={cartState}
        dispatch={dispatch}
        toast={toast}
      />
    </CheckoutLayout>
  )
}