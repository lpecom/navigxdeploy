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
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                  Reservations
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage and track all reservation activities
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="px-6 py-2.5 text-base font-medium bg-secondary/10 text-secondary"
              >
                {isLoading ? "Loading..." : `${reservations?.length || 0} Active Reservations`}
              </Badge>
            </div>

            {/* Pending Reservations Section */}
            <Card className="mb-10 shadow-sm border-muted">
              <CardHeader className="border-b border-muted/20 py-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                  <Calendar className="w-7 h-7 text-primary" />
                  Pending Reservations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 px-8">
                <ReservationsList filter="pending" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Active Rentals Section */}
              <Card className="lg:col-span-1 shadow-sm border-muted">
                <CardHeader className="border-b border-muted/20 py-6">
                  <CardTitle className="flex items-center gap-2.5 text-xl font-semibold">
                    <Clock className="w-5 h-5 text-primary" />
                    Active Rentals
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 px-6">
                  <ActiveRentals />
                </CardContent>
              </Card>

              {/* Reservation History Section */}
              <Card className="lg:col-span-2 shadow-sm border-muted">
                <CardHeader className="border-b border-muted/20 py-6">
                  <CardTitle className="flex items-center gap-2.5 text-xl font-semibold">
                    <FileText className="w-5 h-5 text-primary" />
                    Reservation History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 px-6">
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