import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CartProvider } from '@/contexts/CartContext';
import Index from "./pages/Index";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Reservations from "./pages/Reservations";
import DetailedReservationView from "./components/reservations/DetailedReservationView";
import Vehicles from "./pages/Vehicles";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Performance from "./pages/Performance";
import Accessories from "./pages/Accessories";
import AdminLogin from "./pages/AdminLogin";
import Automations from "./pages/Automations";
import Offers from "./pages/Offers";
import { CheckoutPage } from "./components/checkout/CheckoutPage";

const DetailedReservationViewWrapper = () => {
  const { id } = useParams();
  return <DetailedReservationView reservationId={id || ''} />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/reservations/:id" element={<ProtectedRoute><DetailedReservationViewWrapper /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/accessories" element={<ProtectedRoute><Accessories /></ProtectedRoute>} />
          <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
          <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </TooltipProvider>
    </CartProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <AppContent />
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;