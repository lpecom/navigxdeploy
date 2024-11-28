import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FipeSelectionFormProps {
  brands: any[];
  models: any[];
  years: any[];
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string;
  onBrandSelect: (value: string) => void;
  onModelSelect: (value: string) => void;
  onYearSelect: (value: string) => void;
}

export const FipeSelectionForm = ({
  brands,
  models,
  years,
  selectedBrand,
  selectedModel,
  selectedYear,
  onBrandSelect,
  onModelSelect,
  onYearSelect,
}: FipeSelectionFormProps) => {
  return (
    <div className="space-y-3">
      <Select value={selectedBrand} onValueChange={onBrandSelect}>
        <SelectTrigger className="w-full bg-white/10 border-gray-700 text-white">
          <SelectValue placeholder="Selecione a marca" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedBrand && (
        <Select value={selectedModel} onValueChange={onModelSelect}>
          <SelectTrigger className="w-full bg-white/10 border-gray-700 text-white">
            <SelectValue placeholder="Selecione o modelo" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedModel && (
        <Select value={selectedYear} onValueChange={onYearSelect}>
          <SelectTrigger className="w-full bg-white/10 border-gray-700 text-white">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};