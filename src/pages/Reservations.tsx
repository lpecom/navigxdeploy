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
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Reservations Dashboard
              </h1>
              <Badge variant="outline" className="px-4 py-2 text-base">
                {isLoading ? "Loading..." : `${reservations?.length || 0} Active Reservations`}
              </Badge>
            </div>

            {/* Pending Reservations Section */}
            <Card className="mb-8">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6 text-primary" />
                  Pending Reservations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ReservationsList filter="pending" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Rentals Section */}
              <Card className="lg:col-span-1">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="w-5 h-5 text-primary" />
                    Active Rentals
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ActiveRentals />
                </CardContent>
              </Card>

              {/* Reservation History Section */}
              <Card className="lg:col-span-2">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5 text-primary" />
                    Reservation History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
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