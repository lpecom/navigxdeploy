import { supabase } from "@/integrations/supabase/client";

type VehicleType = 'cars' | 'motorcycles' | 'trucks';

export const fipeApi = {
  getBrands: async (vehicleType: VehicleType) => {
    const { data, error } = await supabase.functions.invoke('fipe-data', {
      body: { action: 'getBrands', vehicleType }
    });
    
    if (error) throw error;
    return data;
  },

  getModels: async (vehicleType: VehicleType, brandId: string) => {
    const { data, error } = await supabase.functions.invoke('fipe-data', {
      body: { action: 'getModels', vehicleType, brandId }
    });
    
    if (error) throw error;
    return data;
  },

  getYears: async (vehicleType: VehicleType, brandId: string, modelId: string) => {
    const { data, error } = await supabase.functions.invoke('fipe-data', {
      body: { action: 'getYears', vehicleType, brandId, modelId }
    });
    
    if (error) throw error;
    return data;
  },

  getVehicle: async (vehicleType: VehicleType, brandId: string, modelId: string, year: string) => {
    const { data, error } = await supabase.functions.invoke('fipe-data', {
      body: { action: 'getVehicle', vehicleType, brandId, modelId, year }
    });
    
    if (error) throw error;
    return data;
  }
};