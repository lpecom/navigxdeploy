import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import Analytics from "@/pages/Analytics";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Reservations from "@/pages/Reservations";
import Calendar from "@/pages/Calendar";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Reports from "@/pages/Reports";
import Performance from "@/pages/Performance";
import Automations from "@/pages/Automations";
import WebsiteSettings from "@/components/website-manager/WebsiteSettings";
import Changelog from "@/pages/Changelog";

const AdminRoutes = () => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
      <Route path="/vehicles/*" element={<Vehicles view="overview" />} />
      <Route path="/vehicles/details/:id" element={<VehicleDetails />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/reservations/:filter" element={<Reservations filter="pending" />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/website-settings" element={<WebsiteSettings />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;