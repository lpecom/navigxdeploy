import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";
import DetailedReservationView from "./components/reservations/DetailedReservationView";
import Vehicles from "./pages/Vehicles";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Performance from "./pages/Performance";

// Wrapper component to get URL parameters
const DetailedReservationViewWrapper = () => {
  const { id } = useParams();
  return <DetailedReservationView reservationId={id || ''} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<DetailedReservationViewWrapper />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;