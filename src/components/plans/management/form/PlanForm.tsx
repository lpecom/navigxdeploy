import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import type { Plans } from "@/types/database";
import { planSchema, type PlanFormValues } from "./PlanFormSchema";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { PlanTypeFields } from "./fields/PlanTypeFields";
import { PricingFields } from "./fields/PricingFields";
import { StatusField } from "./fields/StatusField";

interface PlanFormProps {
  plan: Plans | null;
  onSubmit: (values: PlanFormValues) => void;
}

export const PlanForm = ({ plan, onSubmit }: PlanFormProps) => {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      type: plan?.type ?? "flex",
      period: plan?.period ?? "week",
      base_price: plan?.base_price ?? 0,
      included_km: plan?.included_km ?? 0,
      extra_km_price: plan?.extra_km_price ?? 0,
      is_active: plan?.is_active ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <BasicInfoFields form={form} />
          <PlanTypeFields form={form} />
          <PricingFields form={form} />
          <StatusField form={form} />

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            {plan ? "Update" : "Create"} Plan
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};