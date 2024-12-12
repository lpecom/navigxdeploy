import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Reservation } from "@/types/reservation";

interface CustomerInfoProps {
  customer: Reservation;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/10">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.customerName}`} />
          <AvatarFallback>
            <User className="h-6 w-6 text-primary/60" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Cliente</p>
          <p className="font-medium text-secondary-900">{customer.customerName || 'Cliente não identificado'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Telefone</p>
          <p className="font-medium text-secondary-900">{customer.phone || 'Não informado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium text-secondary-900">{customer.email || 'Não informado'}</p>
        </div>
      </div>
    </div>
  );
};