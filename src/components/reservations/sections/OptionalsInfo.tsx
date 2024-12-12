import { Package2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Optional } from "@/types/reservation";

interface OptionalsInfoProps {
  optionals?: Optional[];
}

export const OptionalsInfo = ({ optionals }: OptionalsInfoProps) => {
  if (!optionals?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">Opcionais:</p>
      <div className="flex flex-wrap gap-2">
        {optionals.map((optional, index) => (
          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-600">
            <Package2 className="w-3 h-3 mr-1" />
            {optional.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};