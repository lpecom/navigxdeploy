import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Facebook, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { CustomerInfo } from "./CustomerInfo";
import { PricingInfo } from "./PricingInfo";
import { StatusBadges } from "./StatusBadges";
import { ReservationActions } from "./ReservationActions";
import { useState } from "react";
import type { Reservation } from "@/types/reservation";

interface ReservationsListProps {
  filter?: "pending" | "approved" | "rejected";
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const mockReservations: Reservation[] = [
    {
      id: "1",
      customerName: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, San Francisco, CA 94105",
      pickupDate: "2024-04-01T10:00:00Z",
      status: "pending",
      paymentStatus: "pending",
      customerStatus: "returning",
      riskScore: 25,
      documentsSubmitted: true,
      createdAt: "2024-03-20T10:00:00Z",
      carCategory: "Luxury",
      leadSource: "facebook",
      weeklyFare: 1500,
      optionals: [
        { name: "Additional Driver", pricePerWeek: 100 },
        { name: "GPS Navigation", pricePerWeek: 50 },
      ],
      kilometersPerWeek: 1000,
    },
    {
      id: "2",
      customerName: "Alice Smith",
      email: "alice@example.com",
      phone: "(555) 987-6543",
      address: "456 Elm St, Los Angeles, CA 90005",
      pickupDate: "2024-04-02T11:00:00Z",
      status: "approved",
      paymentStatus: "paid",
      customerStatus: "new",
      riskScore: 35,
      documentsSubmitted: true,
      createdAt: "2024-03-19T15:30:00Z",
      carCategory: "SUV",
      leadSource: "whatsapp",
      weeklyFare: 900,
      optionals: [],
      kilometersPerWeek: "unlimited",
    },
    {
      id: "3",
      customerName: "Bob Johnson",
      email: "bob@example.com",
      phone: "(555) 456-7890",
      address: "789 Pine St, New York, NY 10001",
      pickupDate: "2024-04-03T12:00:00Z",
      status: "pending",
      paymentStatus: "pending",
      customerStatus: "blocked",
      riskScore: 15,
      documentsSubmitted: false,
      createdAt: "2024-03-18T09:15:00Z",
      carCategory: "Economy",
      leadSource: "facebook",
      weeklyFare: 600,
      optionals: [
        { name: "Child Seat", pricePerWeek: 70 }
      ],
      kilometersPerWeek: 500,
    },
    {
      id: "4",
      customerName: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 234-5678",
      address: "321 Oak St, Chicago, IL 60601",
      pickupDate: "2024-04-04T13:00:00Z",
      status: "pending",
      paymentStatus: "pending",
      customerStatus: "returning",
      riskScore: 35,
      documentsSubmitted: true,
      createdAt: "2024-03-17T14:45:00Z",
      carCategory: "Sports",
      leadSource: "whatsapp",
      weeklyFare: 1200,
      optionals: [],
      kilometersPerWeek: 700,
    }
  ];

  const getLeadSourceIcon = (source: Reservation["leadSource"]) => {
    return source === "facebook" ? (
      <Facebook className="w-4 h-4 text-blue-600" />
    ) : (
      <MessageCircle className="w-4 h-4 text-green-600" />
    );
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredReservations = filter
    ? mockReservations.filter((r) => r.status === filter)
    : mockReservations;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredReservations.map((reservation) => (
        <Card 
          key={reservation.id} 
          className="hover:shadow-lg transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {reservation.customerName}
            </CardTitle>
            <button
              onClick={() => toggleCard(reservation.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={expandedCards[reservation.id] ? "Show less" : "Show more"}
            >
              {expandedCards[reservation.id] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatusBadges reservation={reservation} />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>
                  <span>{reservation.riskScore}%</span>
                </div>
                <Progress value={reservation.riskScore} className="h-2" />
              </div>
              
              {expandedCards[reservation.id] && (
                <div className="space-y-4 animate-accordion-down">
                  <CustomerInfo reservation={reservation} />
                  <PricingInfo reservation={reservation} />
                  <div className="flex items-center justify-end">
                    {getLeadSourceIcon(reservation.leadSource)}
                  </div>
                  <ReservationActions reservation={reservation} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReservationsList;
