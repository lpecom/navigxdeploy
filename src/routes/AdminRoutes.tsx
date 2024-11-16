import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import Index from "@/pages/Index";
import Plans from "@/pages/Plans";
import Reservations from "@/pages/Reservations";
import DetailedReservationView from "@/components/reservations/DetailedReservationView";
import Vehicles from "@/pages/Vehicles";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Performance from "@/pages/Performance";
import Accessories from "@/pages/Accessories";
import AdminLogin from "@/pages/AdminLogin";
import Automations from "@/pages/Automations";
import Offers from "@/pages/Offers";

const DetailedReservationViewWrapper = () => {
  const { id } = useParams();
  return <DetailedReservationView reservationId={id || ''} />;
};

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      
      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Index />} />
        <Route path="plans" element={<Plans />} />
        
        {/* Reservations Routes */}
        <Route path="reservations/pending" element={<Reservations filter="pending" />} />
        <Route path="reservations/pickup" element={<Reservations filter="pickup" />} />
        <Route path="reservations/:id" element={<DetailedReservationViewWrapper />} />
        
        {/* Vehicles Routes */}
        <Route path="vehicles/fleet" element={<Vehicles view="fleet" />} />
        <Route path="vehicles/rentals" element={<Vehicles view="rentals" />} />
        <Route path="vehicles/customers" element={<Vehicles view="customers" />} />
        
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="performance" element={<Performance />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="automations" element={<Automations />} />
        <Route path="offers" element={<Offers />} />
      </Route>
      
      {/* Redirect any unmatched admin routes to login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;