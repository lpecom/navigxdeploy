import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export const OrderPaymentStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Status do Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="success">Aprovado</Badge>
      </CardContent>
    </Card>
  );
};