import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/Sidebar";
import ReservationsList from "@/components/reservations/ReservationsList";
import ActiveRentals from "@/components/reservations/ActiveRentals";
import ReservationHistory from "@/components/reservations/ReservationHistory";
import { Calendar, Clock, FileText } from "lucide-react";

const Reservations = () => {
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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">Reservas</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Gerencie e acompanhe todas as atividades de reserva
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="px-3 py-1.5 text-sm font-medium bg-secondary/10 text-secondary"
              >
                {isLoading ? "Carregando..." : `${reservations?.length || 0} Reservas Ativas`}
              </Badge>
            </div>

            <Card className="shadow-sm border-muted">
              <CardHeader className="border-b border-muted/20 py-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Calendar className="w-5 h-5 text-primary" />
                  Reservas Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4">
                <ReservationsList filter="pending" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 shadow-sm border-muted">
                <CardHeader className="border-b border-muted/20 py-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4 text-primary" />
                    Aluguéis Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-4">
                  <ActiveRentals />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-sm border-muted">
                <CardHeader className="border-b border-muted/20 py-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4 text-primary" />
                    Histórico de Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-4">
                  <ReservationHistory />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reservations;