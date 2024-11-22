import { motion } from "framer-motion";
import { InsuranceSelection } from "./steps/InsuranceSelection";
import { PickupScheduler } from "./steps/PickupScheduler";
import { OrderSummary } from "./steps/OrderSummary";
import { PaymentLocationSelection } from "./steps/PaymentLocationSelection";
import { PaymentSection } from "./steps/PaymentSection";
import { KYCForm } from "./steps/KYCForm";

interface CheckoutStepsProps {
  step: number;
  checkoutSessionId: string | undefined;
  onInsuranceSelect: (insuranceId: string) => void;
  onScheduleSubmit: (data: any) => void;
  onPaymentLocationSelect: (location: 'online' | 'store') => void;
  onPaymentSuccess: (paymentId: string) => void;
  onKYCSubmit: (data: any) => void;
}

export const CheckoutSteps = ({
  step,
  checkoutSessionId,
  onInsuranceSelect,
  onScheduleSubmit,
  onPaymentLocationSelect,
  onPaymentSuccess,
  onKYCSubmit
}: CheckoutStepsProps) => {
  if (!checkoutSessionId) return null;

  return (
    <>
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InsuranceSelection onSelect={onInsuranceSelect} />
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PickupScheduler onSubmit={onScheduleSubmit} />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OrderSummary checkoutSessionId={checkoutSessionId} />
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PaymentLocationSelection onSelect={onPaymentLocationSelect} />
        </motion.div>
      )}

      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {session?.payment_location === 'online' ? (
            <PaymentSection
              checkoutSessionId={checkoutSessionId}
              onSuccess={onPaymentSuccess}
            />
          ) : (
            <KYCForm onSubmit={onKYCSubmit} />
          )}
        </motion.div>
      )}
    </>
  );
};