import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DriverReservationsProps {
  driverId: string;
}

export const DriverReservations = ({ driverId }: DriverReservationsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Minhas Reservas</h1>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Toyota Corolla 2023</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>20/03/2024 - 25/03/2024</span>
                    </div>
                    <Badge variant="secondary">Ativa</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 150,00/dia</p>
                  <p className="text-sm text-muted-foreground">Total: R$ 750,00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma reserva pendente
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="space-y-1">
                      <h3 className="font-medium">Honda Civic 2023</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>01/03/2024 - 05/03/2024</span>
                        </div>
                        <Badge variant="outline">Concluída</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 140,00/dia</p>
                      <p className="text-sm text-muted-foreground">Total: R$ 700,00</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};