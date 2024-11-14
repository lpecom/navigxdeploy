import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, CreditCard, User } from "lucide-react";

interface CustomerSectionProps {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  onCall: () => void;
  onCharge: () => void;
  isCharging: boolean;
}

export const CustomerSection = ({ customer, onCall, onCharge, isCharging }: CustomerSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Informações do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onCall}>
              <PhoneCall className="w-4 h-4 mr-2" />
              Ligar para Cliente
            </Button>
            <Button size="sm" variant="outline" onClick={onCharge} disabled={isCharging}>
              <CreditCard className="w-4 h-4 mr-2" />
              Cobrar Cartão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};