import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Orders from "@/pages/Orders";
import Offers from "@/pages/Offers";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Performance from "@/pages/Performance";
import Automations from "@/pages/Automations";
import Accessories from "@/pages/Accessories";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles view="overview" />} />
      <Route path="/vehicles/categories" element={<Vehicles view="categories" />} />
      <Route path="/vehicles/models" element={<Vehicles view="models" />} />
      <Route path="/vehicles/fleet" element={<Vehicles view="fleet" />} />
      <Route path="/vehicles/maintenance" element={<Vehicles view="maintenance" />} />
      <Route path="/vehicles/:id" element={<VehicleDetails />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;