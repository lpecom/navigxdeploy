import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleInfo } from "./VehicleInfo";
import PaymentHistory from "./PaymentHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, CreditCard, Calendar, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface DriverOverviewProps {
  driverId: string;
}

export const DriverOverview = ({ driverId }: DriverOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        <Button variant="outline" asChild>
          <Link to="/driver/vehicle">
            Ver Meu Veículo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Próxima Revisão</h3>
                  <p className="text-sm text-muted-foreground">Em 3 meses</p>
                </div>
              </div>
              <Badge>Agendada</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Próximo Pagamento</h3>
                  <p className="text-sm text-muted-foreground">R$ 750,00</p>
                </div>
              </div>
              <Badge variant="outline">15/04</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Notificações</h3>
                  <p className="text-sm text-muted-foreground">2 não lidas</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meu Veículo</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleInfo driverId={driverId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentHistory driverId={driverId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};