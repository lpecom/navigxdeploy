import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import Vehicles from "@/pages/Vehicles";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Analytics from "@/pages/Analytics";
import Performance from "@/pages/Performance";
import Reports from "@/pages/Reports";
import Automations from "@/pages/Automations";
import Reservations from "@/pages/Reservations";
import Dashboard from "@/pages/Dashboard";

const AdminRoutes = () => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="vehicles/fleet" element={<Vehicles view="fleet" />} />
      <Route path="vehicles/rentals" element={<Vehicles view="rentals" />} />
      <Route path="vehicles/customers" element={<Vehicles view="customers" />} />
      <Route path="offers" element={<Offers />} />
      <Route path="accessories" element={<Accessories />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="performance" element={<Performance />} />
      <Route path="reports" element={<Reports />} />
      <Route path="automations" element={<Automations />} />
      <Route path="reservations/pending" element={<Reservations filter="pending" />} />
      <Route path="reservations/pickup" element={<Reservations filter="pickup" />} />
    </Routes>
  );
};

export default AdminRoutes;