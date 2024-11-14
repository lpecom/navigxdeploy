import { useState } from "react";
import type { Reservation } from "@/types/reservation";
import { ReservationCard } from "./ReservationCard";

interface ReservationsListProps {
  filter?: "pending" | "approved" | "rejected";
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const mockReservations: Reservation[] = [
    {
      id: "1",
      customerName: "João Silva",
      email: "joao@example.com",
      cpf: "123.456.789-00",
      phone: "(11) 98765-4321",
      address: "Rua Augusta, 1500, Jardins, São Paulo - SP",
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
        { name: "Motorista Adicional", pricePerWeek: 100 },
        { name: "GPS", pricePerWeek: 50 },
      ],
      kilometersPerWeek: 1000,
    },
    {
      id: "2",
      customerName: "Maria Santos",
      email: "maria@example.com",
      cpf: "987.654.321-00",
      phone: "(11) 97654-3210",
      address: "Av. Paulista, 1000, Bela Vista, São Paulo - SP",
      pickupDate: new Date(Date.now() + 86400000).toISOString(),
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
      cpf: "111.222.333-44",
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
      cpf: "444.555.666-77",
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
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          isExpanded={!!expandedCards[reservation.id]}
          onToggle={() => toggleCard(reservation.id)}
        />
      ))}
    </div>
  );
};

export default ReservationsList;
