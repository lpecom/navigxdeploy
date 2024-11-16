import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleInfo } from "./VehicleInfo";
import PaymentHistory from "./PaymentHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, CreditCard, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface DriverOverviewProps {
  driverId: string;
}

export const DriverOverview = ({ driverId }: DriverOverviewProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/driver/vehicle" className="col-span-2">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Seu Veículo Atual</CardTitle>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardHeader>
            <CardContent>
              <VehicleInfo driverId={driverId} />
            </CardContent>
          </Card>
        </Link>

        <div className="col-span-1 space-y-4">
          <Link to="/driver/reservations">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Reservas Ativas</h3>
                      <p className="text-sm text-muted-foreground">Ver detalhes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/driver/financial">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Financeiro</h3>
                      <p className="text-sm text-muted-foreground">Pagamentos e faturas</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PaymentHistory driverId={driverId} />
        
        <Card>
          <CardHeader>
            <CardTitle>Ofertas Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-medium mb-2">Upgrade de Veículo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Aproveite condições especiais para fazer um upgrade do seu veículo.
                </p>
                <Button asChild>
                  <Link to="/driver/promotions">Ver Ofertas</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};