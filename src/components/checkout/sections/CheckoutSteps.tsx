import { motion } from "framer-motion";
import { CustomerForm } from "./CustomerForm";
import { PickupScheduler } from "./PickupScheduler";
import { PaymentSection } from "./PaymentSection";
import { CheckoutAuth } from "./auth/CheckoutAuth";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InsurancePackageStep } from "./steps/InsurancePackageStep";

interface CheckoutStepsProps {
  step: number;
  isLoggedIn: boolean;
  customerId: string | null;
  checkoutSessionId: string | undefined;
  onLoginSuccess: (userId: string) => void;
  onCustomerSubmit: (data: any) => void;
  onScheduleSubmit: (data: any) => void;
  onPaymentSuccess: (paymentId: string) => void;
  onInsuranceSelect?: (insuranceId: string) => void;
  selectedInsurance?: string;
}

export const CheckoutSteps = ({
  step,
  isLoggedIn,
  customerId,
  checkoutSessionId,
  onLoginSuccess,
  onCustomerSubmit,
  onScheduleSubmit,
  onPaymentSuccess,
  onInsuranceSelect,
  selectedInsurance
}: CheckoutStepsProps) => {
  return (
    <>
      {step === 1 && !isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CheckoutAuth onLoginSuccess={onLoginSuccess} />
          <CustomerForm onSubmit={onCustomerSubmit} />
        </motion.div>
      )}

      {step === 2 && onInsuranceSelect && (
        <InsurancePackageStep 
          onSelect={onInsuranceSelect}
          selectedInsurance={selectedInsurance}
          onBack={() => window.history.back()}
        />
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <PickupScheduler onSubmit={onScheduleSubmit} />
        </motion.div>
      )}

      {step === 4 && customerId && checkoutSessionId && (
        <PaymentSection
          amount={0}
          driverId={customerId}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}

      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center bg-gray-900/50 border-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Reservation Confirmed!</h2>
            <p className="text-gray-400 mb-8">
              Your reservation has been received successfully. Our team will contact you soon to confirm the details.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto"
            >
              Return to Home
            </Button>
          </Card>
        </motion.div>
      )}
    </>
  );
};