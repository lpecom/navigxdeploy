import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  bullet_points: { km: string; price: string; }[];
  highlight: boolean;
  display_order: number;
  conditions?: Record<string, any> | null;
  category_id: string;
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

      // Transform the data to ensure proper typing
      const transformedData: CategoryPlan[] = data.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : [],
        bullet_points: Array.isArray(plan.bullet_points) ? plan.bullet_points : [],
        conditions: plan.conditions || null
      }));

      return transformedData;
    },
    enabled: !!categoryId,
  });
};