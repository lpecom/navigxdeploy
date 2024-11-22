import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { PlanTypeFields } from "./fields/PlanTypeFields";
import { PricingFields } from "./fields/PricingFields";
import { StatusField } from "./fields/StatusField";
import { FeaturesField } from "./fields/FeaturesField";
import { KmRangesField } from "./fields/KmRangesField";
import { DisplayOrderField } from "./fields/DisplayOrderField";
import { HighlightField } from "./fields/HighlightField";
import { planSchema, type PlanFormValues } from "./PlanFormSchema";
import type { Plans } from "@/types/supabase/plans";

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
      period: plan?.period ?? "month",
      base_price: plan?.base_price ?? 0,
      included_km: plan?.included_km ?? 0,
      extra_km_price: plan?.extra_km_price ?? 0,
      is_active: plan?.is_active ?? true,
      features: plan?.features ?? [],
      bullet_points: plan?.bullet_points ?? [],
      highlight: plan?.highlight ?? false,
      display_order: plan?.display_order ?? 0
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <BasicInfoFields form={form} />
              <PlanTypeFields form={form} />
              <PricingFields form={form} />
              <div className="flex gap-4">
                <div className="flex-1">
                  <DisplayOrderField form={form} />
                </div>
                <div className="flex-1">
                  <HighlightField form={form} />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <FeaturesField form={form} />
              <KmRangesField form={form} />
              <StatusField form={form} />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 h-12 text-lg font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            {plan ? "Update" : "Create"} Plan
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};