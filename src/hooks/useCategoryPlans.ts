import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface CategoryPlan {
  id: string;
  name: string;
  description?: string | null;
  type: 'flex' | 'monthly' | 'black';
  period: 'week' | 'month';
  base_price: number;
  included_km: number;
  extra_km_price?: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  features: string[];
  bullet_points: Array<{ km: string; price: string; }>;
  highlight: boolean;
  display_order: number;
  conditions: Record<string, any> | null;
  category_id: string;
}

type PlanType = 'flex' | 'monthly' | 'black';
type PeriodType = 'week' | 'month';

interface BulletPoint {
  km: string;
  price: string;
}

export const useCategoryPlans = (categoryId?: string) => {
  return useQuery({
    queryKey: ['category-plans', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from('category_plans')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;

      // Transform and validate the data to ensure proper typing
      const transformedData: CategoryPlan[] = data.map(plan => {
        // Validate and cast plan type
        const planType = plan.type as PlanType;
        if (!['flex', 'monthly', 'black'].includes(planType)) {
          throw new Error(`Invalid plan type: ${plan.type}`);
        }

        // Validate and cast period
        const period = plan.period as PeriodType;
        if (!['week', 'month'].includes(period)) {
          throw new Error(`Invalid period: ${plan.period}`);
        }

        // Parse bullet points safely
        const bulletPoints = Array.isArray(plan.bullet_points) 
          ? plan.bullet_points.map((bp: any) => ({
              km: typeof bp === 'object' && bp !== null ? String(bp.km || '') : '',
              price: typeof bp === 'object' && bp !== null ? String(bp.price || '') : ''
            }))
          : [];

        // Parse features safely
        const features = Array.isArray(plan.features) 
          ? plan.features.map(f => String(f))
          : [];

        // Parse conditions safely
        const conditions = plan.conditions 
          ? typeof plan.conditions === 'object' 
            ? plan.conditions as Record<string, any>
            : null
          : null;

        return {
          ...plan,
          type: planType,
          period: period,
          features,
          bullet_points: bulletPoints,
          conditions,
          highlight: Boolean(plan.highlight),
          display_order: Number(plan.display_order || 0),
          is_active: Boolean(plan.is_active)
        };
      });

      return transformedData;
    },
    enabled: !!categoryId,
  });
};