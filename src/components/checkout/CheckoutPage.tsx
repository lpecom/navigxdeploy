import { CheckoutLayout } from "./ui/CheckoutLayout";
import { EmptyCartMessage } from "./ui/EmptyCartMessage";
import { CheckoutContent } from "./sections/CheckoutContent";
import { useCheckoutState } from "./sections/CheckoutContainer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CheckoutPage = () => {
  const {
    step,
    setStep,
    customerId,
    setCustomerId,
    cartState,
    dispatch,
    toast
  } = useCheckoutState();
  
  const navigate = useNavigate();

  // Redirect to plans if no items and no session
  useEffect(() => {
    if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
      navigate('/plans');
    }
  }, [cartState.items.length, cartState.checkoutSessionId, navigate]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (step > 1) {
        setStep(step - 1);
      } else {
        navigate('/plans');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [step, setStep, navigate]);

  // Show empty cart message if needed
  if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
    return (
      <CheckoutLayout>
        <EmptyCartMessage />
      </CheckoutLayout>
    );
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
  );
};