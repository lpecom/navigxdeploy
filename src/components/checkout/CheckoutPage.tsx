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
    toast,
    guestToken,
    guestEmail,
    setGuestEmail
  } = useCheckoutState()

  // Only show empty cart message if there's no selected category
  const categoryData = sessionStorage.getItem('selectedCategory');
  if (!categoryData) {
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
        guestToken={guestToken}
        guestEmail={guestEmail}
        setGuestEmail={setGuestEmail}
      />
    </CheckoutLayout>
  )
}