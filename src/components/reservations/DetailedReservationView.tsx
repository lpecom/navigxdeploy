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

interface DetailedReservationViewProps {
  reservationId: string;
}

const DetailedReservationView = ({ reservationId }: DetailedReservationViewProps) => {
  const { toast } = useToast();
  const [isCharging, setIsCharging] = useState(false);

  // Mock data - In a real app, this would come from an API
  const reservation = {
    id: reservationId,
    customer: {
      name: "João Silva",
      phone: "+55 11 98765-4321",
      email: "joao@email.com",
      history: "Premium Member since 2022"
    },
    vehicle: {
      model: "Toyota Corolla 2023",
      plate: "ABC-1234",
      mileage: 45000,
      lastService: "2024-02-15",
      nextServiceDue: "2024-05-15"
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
        type: "Deposit",
        amount: 500.00
      },
      {
        date: "2024-03-20",
        type: "Daily Rate",
        amount: 150.00
      }
    ],
    incidents: [
      {
        date: "2024-03-21",
        type: "Parking Ticket",
        amount: 75.00,
        status: "pending"
      }
    ]
  };

  const handleCall = () => {
    toast({
      title: "Initiating call",
      description: `Calling ${reservation.customer.phone}`
    });
  };

  const handleCharge = () => {
    setIsCharging(true);
    toast({
      title: "Processing payment",
      description: "Charging customer card..."
    });
    // Simulate API call
    setTimeout(() => {
      setIsCharging(false);
      toast({
        title: "Payment processed",
        description: "Successfully charged customer card"
      });
    }, 2000);
  };

  const handleServiceRequest = () => {
    toast({
      title: "Service requested",
      description: "Maintenance team has been notified"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Customer Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{reservation.customer.name}</p>
              <p className="text-sm text-muted-foreground">{reservation.customer.email}</p>
              <p className="text-sm text-muted-foreground">{reservation.customer.phone}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCall}>
                <PhoneCall className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button size="sm" variant="outline" onClick={handleCharge} disabled={isCharging}>
                <CreditCard className="w-4 h-4 mr-2" />
                Charge Card
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            Vehicle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{reservation.vehicle.model}</p>
                <p className="text-sm text-muted-foreground">Plate: {reservation.vehicle.plate}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Mileage:</span>
                  <span className="font-medium">{reservation.vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Service:</span>
                  <span className="font-medium">{format(new Date(reservation.vehicle.lastService), "PP", { locale: ptBR })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Service Due:</span>
                  <span className="font-medium">{format(new Date(reservation.vehicle.nextServiceDue), "PP", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <Button variant="outline" onClick={handleServiceRequest}>
                <Wrench className="w-4 h-4 mr-2" />
                Request Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Details */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservation.transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{transaction.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "PP", { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Incidents & Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservation.incidents.map((incident, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{incident.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(incident.date), "PP", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-600">
                      ${incident.amount.toFixed(2)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rental History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Customer History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {reservation.customer.history}
          </p>
          <Separator className="my-4" />
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View Full History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedReservationView;