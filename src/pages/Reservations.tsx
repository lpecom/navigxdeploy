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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Aluguéis Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActiveRentals />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Reservas Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReservationsList filter="pending" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Histórico de Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReservationHistory />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reservations;