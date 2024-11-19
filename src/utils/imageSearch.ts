import { supabase } from "@/integrations/supabase/client";

export const searchAndUpdateCarImage = async (modelName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('crawl-car-images', {
      body: { modelName }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching for car image:', error);
    throw error;
  }
};