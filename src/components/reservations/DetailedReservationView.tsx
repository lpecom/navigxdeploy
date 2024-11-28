import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Car,
  PhoneCall,
  CreditCard,
  FileText,
  History,
  Wrench,
  DollarSign,
  User,
  Bell
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CustomerSection } from "./sections/CustomerSection";
import { VehicleSection } from "./sections/VehicleSection";
import { TransactionsSection } from "./sections/TransactionsSection";
import { IncidentsSection } from "./sections/IncidentsSection";
import { HistorySection } from "./sections/HistorySection";
import type { VehicleStatus } from "@/types/vehicles";

interface DetailedReservationViewProps {
  reservationId: string;
}

const DetailedReservationView = ({ reservationId }: DetailedReservationViewProps) => {
  const { toast } = useToast();
  const [isCharging, setIsCharging] = useState(false);

  // Mock data - Em uma aplicação real, isso viria de uma API
  const reservation = {
    id: reservationId,
    customer: {
      name: "João Silva",
      phone: "+55 11 98765-4321",
      email: "joao@email.com",
      history: "Cliente Premium desde 2022"
    },
    vehicle: {
      model: "Toyota Corolla 2023",
      plate: "ABC-1234",
      mileage: 45000,
      lastService: "2024-02-15",
      nextServiceDue: "2024-05-15",
      status: 'available' as VehicleStatus
    },
    rental: {
      startDate: "2024-03-20",
      endDate: "2024-03-25",
      status: "active",
      baseRate: 150.00,
      deposit: 500.00
    },
    transactions: [
      {
        date: "2024-03-20",
        type: "Caução",
        amount: 500.00
      },
      {
        date: "2024-03-20",
        type: "Diária",
        amount: 150.00
      }
    ],
    incidents: [
      {
        date: "2024-03-21",
        type: "Multa de Estacionamento",
        amount: 75.00,
        status: "pendente"
      }
    ]
  };

  const handleCall = () => {
    toast({
      title: "Iniciando chamada",
      description: `Ligando para ${reservation.customer.phone}`
    });
  };

  const handleCharge = () => {
    setIsCharging(true);
    toast({
      title: "Processando pagamento",
      description: "Cobrando cartão do cliente..."
    });
    setTimeout(() => {
      setIsCharging(false);
      toast({
        title: "Pagamento processado",
        description: "Cartão do cliente cobrado com sucesso"
      });
    }, 2000);
  };

  const handleServiceRequest = () => {
    toast({
      title: "Serviço solicitado",
      description: "Equipe de manutenção foi notificada"
    });
  };

  return (
    <div className="space-y-6">
      <CustomerSection 
        customer={reservation.customer} 
        onCall={handleCall} 
        onCharge={handleCharge} 
        isCharging={isCharging} 
      />
      <VehicleSection 
        vehicle={reservation.vehicle} 
        onServiceRequest={handleServiceRequest} 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsSection transactions={reservation.transactions} />
        <IncidentsSection incidents={reservation.incidents} />
      </div>
      <HistorySection history={reservation.customer.history} />
    </div>
  );
};

export default DetailedReservationView;