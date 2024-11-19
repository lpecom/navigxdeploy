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
  const brand = Object.keys(BRAND_LOGOS).find(brand => 
    modelName.toLowerCase().startsWith(brand.toLowerCase())
  );
  return brand || null;
};

export const uploadBrandLogo = async (url: string, brand: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch brand logo:', response.statusText);
      return null;
    }
    
    const blob = await response.blob();
    
    const fileName = `${brand.toLowerCase()}-logo.svg`;
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(`brand-logos/${fileName}`, blob, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (error) {
      console.error('Error uploading brand logo:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(`brand-logos/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Error fetching or uploading brand logo:', error);
    return null;
  }
};

export const updateModelWithBrandLogo = async (modelId: string, modelName: string) => {
  const brand = getBrandFromModel(modelName);
  if (!brand || !BRAND_LOGOS[brand]) return;

  const logoUrl = await uploadBrandLogo(BRAND_LOGOS[brand], brand);
  if (!logoUrl) return;

  const { error } = await supabase
    .from('car_models')
    .update({ brand_logo_url: logoUrl })
    .eq('id', modelId);

  if (error) {
    console.error('Error updating model with brand logo:', error);
  }
};