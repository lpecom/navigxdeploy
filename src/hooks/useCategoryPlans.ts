import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Plans } from "@/types/supabase/plans";

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
      return data as Plans[];
    },
    enabled: !!categoryId,
  });
};