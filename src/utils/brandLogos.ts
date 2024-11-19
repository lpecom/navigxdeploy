import { supabase } from "@/integrations/supabase/client";

const BRAND_LOGOS: Record<string, string> = {
  'Toyota': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/toyota.svg',
  'Honda': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/honda.svg',
  'Volkswagen': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/volkswagen.svg',
  'BMW': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/bmw.svg',
  'Mercedes': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mercedes.svg',
  'Audi': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/audi.svg',
  'Ford': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/ford.svg',
  'Chevrolet': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/chevrolet.svg',
  'Hyundai': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hyundai.svg',
  'Kia': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/kia.svg',
  'Fiat': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/fiat.svg',
  'Renault': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/renault.svg',
  'Nissan': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nissan.svg',
  'Peugeot': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/peugeot.svg',
  'Citroen': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/citroen.svg',
};

export const getBrandFromModel = (modelName: string): string | null => {
  if (!modelName) return null;
  
  const brand = Object.keys(BRAND_LOGOS).find(brand => 
    modelName.toLowerCase().startsWith(brand.toLowerCase())
  );
  return brand || null;
};

export const getBrandLogo = (modelName: string): string | null => {
  const brand = getBrandFromModel(modelName);
  return brand ? BRAND_LOGOS[brand] : null;
};

export const updateModelWithBrandLogo = async (modelId: string, modelName: string) => {
  const brand = getBrandFromModel(modelName);
  if (!brand || !BRAND_LOGOS[brand]) return;

  try {
    const response = await fetch(BRAND_LOGOS[brand]);
    if (!response.ok) {
      console.error('Failed to fetch brand logo:', response.statusText);
      return;
    }
    
    const blob = await response.blob();
    const fileName = `${brand.toLowerCase()}-logo.svg`;
    
    const { data, error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(`brand-logos/${fileName}`, blob, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading brand logo:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(`brand-logos/${fileName}`);

    const { error: updateError } = await supabase
      .from('car_models')
      .update({ brand_logo_url: publicUrl })
      .eq('id', modelId);

    if (updateError) {
      console.error('Error updating model with brand logo:', updateError);
    }
  } catch (error) {
    console.error('Error in updateModelWithBrandLogo:', error);
  }
};