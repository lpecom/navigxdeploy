import { motion } from "framer-motion";
import { CustomerForm } from "./CustomerForm";
import { PickupScheduler } from "./PickupScheduler";
import { PaymentSection } from "./PaymentSection";
import { CheckoutAuth } from "./auth/CheckoutAuth";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutStepsProps {
  step: number;
  isLoggedIn: boolean;
  customerId: string | null;
  checkoutSessionId: string | undefined;
  onLoginSuccess: (userId: string) => void;
  onCustomerSubmit: (data: any) => void;
  onScheduleSubmit: (data: any) => void;
  onPaymentSuccess: (paymentId: string) => void;
}

export const CheckoutSteps = ({
  step,
  isLoggedIn,
  customerId,
  checkoutSessionId,
  onLoginSuccess,
  onCustomerSubmit,
  onScheduleSubmit,
  onPaymentSuccess
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

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <PickupScheduler onSubmit={onScheduleSubmit} />
        </motion.div>
      )}

      {step === 3 && customerId && checkoutSessionId && (
        <PaymentSection
          amount={0} // This will be passed from parent
          driverId={customerId}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}

      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reserva Confirmada!</h2>
            <p className="text-gray-600 mb-8">
              Sua reserva foi recebida com sucesso. Em breve nossa equipe entrará em contato para confirmar os detalhes.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto"
            >
              Voltar para Home
            </Button>
          </Card>
        </motion.div>
      )}
    </>
  );
};