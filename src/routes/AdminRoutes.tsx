import { Routes, Route, Navigate } from "react-router-dom";
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

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
      <Route path="/vehicles" element={<Navigate to="/admin/vehicles/overview" replace />} />
      <Route path="/vehicles/:view" element={<Vehicles />} />
      <Route path="/vehicles/details/:id" element={<VehicleDetails />} />
      <Route path="/reservations/:filter" element={<Reservations />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;