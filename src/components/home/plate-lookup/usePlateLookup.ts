import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePlateLookup = () => {
  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [fipeData, setFipeData] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!plate.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma placa válida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First check the license plate
      const { data: plateData, error: plateError } = await supabase.functions.invoke('check-license-plate', {
        body: { plate }
      });

      if (plateError) throw plateError;

      // Then get FIPE data based on the plate info
      if (plateData) {
        const { data: fipeResult } = await supabase.functions.invoke('fipe-data', {
          body: { 
            action: 'getByPlateInfo',
            plateInfo: {
              brand: plateData.brand,
              model: plateData.model,
              year: plateData.year
            }
          }
        });

        setVehicleInfo(plateData);
        if (fipeResult) {
          setFipeData(fipeResult);
        }

        // Also fetch FIPE brands for manual selection if needed
        const { data: brandsData } = await supabase.functions.invoke('fipe-data', {
          body: { action: 'getBrands', vehicleType: 'cars' }
        });
        setBrands(brandsData || []);
        
        toast({
          title: "Sucesso",
          description: "Encontramos informações para esta placa",
        });
      } else {
        toast({
          title: "Nenhuma informação encontrada",
          description: "Não encontramos dados do veículo para esta placa",
        });
      }
    } catch (error: any) {
      console.error('Error fetching vehicle info:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar informações do veículo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandSelect = async (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    setSelectedYear("");
    setFipeData(null);
    
    try {
      const { data } = await supabase.functions.invoke('fipe-data', {
        body: { action: 'getModels', vehicleType: 'cars', brandId }
      });
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os modelos",
        variant: "destructive",
      });
    }
  };

  const handleModelSelect = async (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear("");
    setFipeData(null);
    
    try {
      const { data } = await supabase.functions.invoke('fipe-data', {
        body: {
          action: 'getYears',
          vehicleType: 'cars',
          brandId: selectedBrand,
          modelId
        }
      });
      setYears(data || []);
    } catch (error) {
      console.error('Error fetching years:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anos",
        variant: "destructive",
      });
    }
  };

  const handleYearSelect = async (year: string) => {
    setSelectedYear(year);
    
    try {
      const { data } = await supabase.functions.invoke('fipe-data', {
        body: {
          action: 'getVehicle',
          vehicleType: 'cars',
          brandId: selectedBrand,
          modelId: selectedModel,
          year
        }
      });
      setFipeData(data);
    } catch (error) {
      console.error('Error fetching FIPE data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados FIPE",
        variant: "destructive",
      });
    }
  };

  return {
    plate,
    setPlate,
    isLoading,
    vehicleInfo,
    brands,
    selectedBrand,
    models,
    selectedModel,
    years,
    selectedYear,
    fipeData,
    handleSearch,
    handleBrandSelect,
    handleModelSelect,
    handleYearSelect,
  };
};