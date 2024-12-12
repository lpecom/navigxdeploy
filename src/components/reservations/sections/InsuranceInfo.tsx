import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsuranceInfoProps {
  insuranceOption?: {
    name: string;
    price: number;
    coverage_details: Record<string, boolean>;
  };
}

export const InsuranceInfo = ({ insuranceOption }: InsuranceInfoProps) => {
  if (!insuranceOption) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">Seguro Selecionado:</p>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-50 text-green-600">
          <Shield className="w-3 h-3 mr-1" />
          {insuranceOption.name}
        </Badge>
        <span className="text-sm text-gray-600">
          R$ {insuranceOption.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};