import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Optional } from "../../types";

interface OrderOptionalsProps {
  optionals: Optional[];
}

export const OrderOptionals = ({ optionals }: OrderOptionalsProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Opcionais Solicitados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {optionals?.length > 0 ? (
          <div className="space-y-4">
            {optionals.map((optional, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{optional.name}</span>
                <Badge variant="secondary">
                  R$ {optional.price.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum opcional selecionado</p>
        )}
      </CardContent>
    </Card>
  );
};