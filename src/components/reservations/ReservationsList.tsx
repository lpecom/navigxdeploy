import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ThermometerSnowflake, ThermometerSun, Facebook, Car, MessageCircle, Eye, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  riskScore: number;
  documentsSubmitted: boolean;
  createdAt: string;
  carCategory: "SUV" | "Luxury" | "Economy" | "Sports";
  leadSource: "facebook" | "whatsapp";
}

interface ReservationsListProps {
  filter?: "pending" | "approved" | "rejected";
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const { toast } = useToast();

  // Mock data with more variety
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
      carCategory: "Luxury",
      leadSource: "facebook"
    },
    {
      id: "2",
      customerName: "Alice Smith",
      email: "alice@example.com",
      phone: "(555) 987-6543",
      status: "pending",
      riskScore: 45,
      documentsSubmitted: true,
      createdAt: "2024-03-19T15:30:00Z",
      carCategory: "SUV",
      leadSource: "whatsapp"
    },
    {
      id: "3",
      customerName: "Bob Johnson",
      email: "bob@example.com",
      phone: "(555) 456-7890",
      status: "pending",
      riskScore: 15,
      documentsSubmitted: false,
      createdAt: "2024-03-18T09:15:00Z",
      carCategory: "Economy",
      leadSource: "facebook"
    },
    {
      id: "4",
      customerName: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 234-5678",
      status: "pending",
      riskScore: 35,
      documentsSubmitted: true,
      createdAt: "2024-03-17T14:45:00Z",
      carCategory: "Sports",
      leadSource: "whatsapp"
    }
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

  const handleAction = (action: 'approve' | 'reject' | 'view', reservation: Reservation) => {
    const messages = {
      approve: 'Reservation approved successfully',
      reject: 'Reservation rejected',
      view: 'Opening reservation details'
    };

    toast({
      title: messages[action],
      description: `Action performed for ${reservation.customerName}`,
    });
  };

  const getCarCategoryBadge = (category: Reservation['carCategory']) => {
    const colors = {
      Luxury: "bg-purple-100 text-purple-800",
      SUV: "bg-blue-100 text-blue-800",
      Economy: "bg-green-100 text-green-800",
      Sports: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={`flex gap-1 items-center ${colors[category]}`}>
        <Car className="w-4 h-4" />
        {category}
      </Badge>
    );
  };

  const getLeadSourceIcon = (source: Reservation['leadSource']) => {
    return source === 'facebook' ? 
      <Facebook className="w-4 h-4 text-blue-600" /> : 
      <MessageCircle className="w-4 h-4 text-green-600" />;
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
              <div className="flex items-center justify-between">
                {getCarCategoryBadge(reservation.carCategory)}
                {getLeadSourceIcon(reservation.leadSource)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>
                  <span>{reservation.riskScore}%</span>
                </div>
                <Progress value={reservation.riskScore} className="h-2" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-600"
                  onClick={() => handleAction('approve', reservation)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600"
                  onClick={() => handleAction('reject', reservation)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction('view', reservation)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReservationsList;