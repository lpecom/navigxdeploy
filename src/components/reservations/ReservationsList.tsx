import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThermometerSnowflake, ThermometerSun, User, FileText } from "lucide-react";

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  riskScore: number;
  documentsSubmitted: boolean;
  createdAt: string;
}

interface ReservationsListProps {
  filter?: "pending" | "approved" | "rejected";
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  // This would be replaced with actual data from your API
  const mockReservations: Reservation[] = [
    {
      id: "1",
      customerName: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      status: "pending",
      riskScore: 25,
      documentsSubmitted: true,
      createdAt: "2024-03-20T10:00:00Z",
    },
    // Add more mock data as needed
  ];

  const getRiskBadge = (score: number) => {
    if (score <= 30) {
      return (
        <Badge className="bg-success text-white flex gap-1 items-center">
          <ThermometerSnowflake className="w-4 h-4" />
          Low Risk
        </Badge>
      );
    }
    return (
      <Badge className="bg-destructive text-white flex gap-1 items-center">
        <ThermometerSun className="w-4 h-4" />
        High Risk
      </Badge>
    );
  };

  const filteredReservations = filter
    ? mockReservations.filter((r) => r.status === filter)
    : mockReservations;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredReservations.map((reservation) => (
        <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {reservation.customerName}
            </CardTitle>
            {getRiskBadge(reservation.riskScore)}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{reservation.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>
                  {reservation.documentsSubmitted ? "Documents Complete" : "Missing Documents"}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>
                  <span>{reservation.riskScore}%</span>
                </div>
                <Progress value={reservation.riskScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReservationsList;