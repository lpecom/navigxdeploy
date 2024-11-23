import { motion } from "framer-motion"
import { CheckoutProgress } from "./CheckoutProgress"
import { EnhancedSummary } from "./EnhancedSummary"
import { CustomerForm } from "./CustomerForm"
import { PickupScheduler } from "./PickupScheduler"
import { PaymentSection } from "./PaymentSection"
import { SuccessSection } from "./SuccessSection"
import { SupportCard } from "./SupportCard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PlanSelectionStep } from "./steps/PlanSelectionStep"
import { InsurancePackageStep } from "./steps/InsurancePackageStep"
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { Card } from "@/components/ui/card"
import { CategorySelector } from "@/pages/reservation/components/CategorySelector"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import type { Category } from "@/types/offers"

interface CheckoutContentProps {
  step: number;
  customerId: string | null;
  cartState: any;
  dispatch: any;
  toast: any;
  setStep: (step: number) => void;
  setCustomerId: (id: string | null) => void;
}

export const CheckoutContent = ({
  step,
  customerId,
  cartState,
  dispatch,
  toast,
  setStep,
  setCustomerId
}: CheckoutContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  if (step === 1) {
    return (
      <CategorySelector 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => {
          setSelectedCategory(category);
          setStep(2);
          toast({
            title: "Categoria selecionada!",
            description: "Agora vamos escolher seu plano.",
          });
        }}
      />
    );
  }

  if (step === 2) {
    return (
      <PlanSelectionStep 
        onNext={() => {
          setStep(3);
          toast({
            title: "Plano selecionado!",
            description: "Agora vamos escolher sua proteção.",
          });
        }}
      />
    );
  }

  if (step === 3) {
    return (
      <InsurancePackageStep 
        onSelect={(insuranceId) => {
          setStep(4);
          toast({
            title: "Proteção selecionada!",
            description: "Agora vamos escolher seus opcionais.",
          });
        }}
        onBack={() => setStep(2)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {step > 1 && (
        <Button
          variant="ghost"
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}

      <CheckoutProgress currentStep={step} />
      
      <div className={`grid gap-4 ${step === 1 ? '' : 'lg:grid-cols-3'}`}>
        <div className={step === 1 ? '' : 'lg:col-span-2'}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 4 && (
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white">Escolha seus opcionais</h2>
                <OptionalsList />
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => setStep(5)} 
                    className="bg-primary hover:bg-primary/90 text-white gap-1.5"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
            
            {step === 5 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 6 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 7 && customerId && (
              <PaymentSection
                amount={cartState.total}
                driverId={customerId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            {step === 8 && (
              <SuccessSection />
            )}
          </motion.div>
        </div>

        {step > 1 && (
          <div className="space-y-4">
            <EnhancedSummary />
            {step < 8 && <SupportCard />}
          </div>
        )}
      </div>
    </motion.div>
  );
};
