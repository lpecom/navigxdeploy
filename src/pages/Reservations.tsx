import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/dashboard/Sidebar";
import ActiveRentals from "@/components/reservations/ActiveRentals";
import ReservationHistory from "@/components/reservations/ReservationHistory";

const Reservations = () => {
  const { toast } = useToast();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      // Simulated API call
      return Promise.resolve([
        {
          id: 1,
          customer: "João Silva",
          vehicle: "Toyota Corolla 2023",
          startDate: "2024-02-20",
          endDate: "2024-02-25",
          status: "active"
        },
        {
          id: 2,
          customer: "Maria Santos",
          vehicle: "Honda Civic 2023",
          startDate: "2024-02-22",
          endDate: "2024-02-24",
          status: "pending"
        }
      ]);
    }
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
              <Badge variant="outline" className="px-4 py-1">
                {isLoading ? "Carregando..." : `${reservations?.length || 0} Reservas Ativas`}
              </Badge>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Aluguéis Ativos
                </TabsTrigger>
                <TabsTrigger value="reservations" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Reservas
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <ActiveRentals />
              </TabsContent>
              <TabsContent value="reservations">
                <Card>
                  <CardHeader>
                    <CardTitle>Reservas Pendentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reservations?.filter(r => r.status === "pending").map(reservation => (
                        <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{reservation.customer}</h3>
                            <p className="text-sm text-gray-500">{reservation.vehicle}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reservation.startDate).toLocaleDateString()} - 
                              {new Date(reservation.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => 
                              toast({
                                title: "Reserva aprovada",
                                description: `Reserva para ${reservation.customer} foi aprovada.`
                              })
                            }>
                              Aprovar
                            </Button>
                            <Button variant="destructive" onClick={() => 
                              toast({
                                title: "Reserva rejeitada",
                                description: `Reserva para ${reservation.customer} foi rejeitada.`
                              })
                            }>
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <ReservationHistory />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reservations;