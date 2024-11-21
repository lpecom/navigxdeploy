import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Reservations from "@/pages/Reservations";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Optionals from "@/pages/Optionals";
import Analytics from "@/pages/Analytics";
import Performance from "@/pages/Performance";
import Reports from "@/pages/Reports";
import Automations from "@/pages/Automations";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

const AdminRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<Dashboard />} />
              
              {/* Vehicle Routes */}
              <Route path="vehicles/overview" element={<Vehicles view="overview" />} />
              <Route path="vehicles/categories" element={<Vehicles view="categories" />} />
              <Route path="vehicles/models" element={<Vehicles view="models" />} />
              <Route path="vehicles/fleet" element={<Vehicles view="fleet" />} />
              <Route path="vehicles/maintenance" element={<Vehicles view="maintenance" />} />
              <Route path="vehicles/:id" element={<VehicleDetails />} />
              
              {/* Customer Routes */}
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              
              {/* Reservation Routes */}
              <Route path="reservations/pending" element={<Reservations filter="pending" />} />
              <Route path="reservations/pickup" element={<Reservations filter="pickup" />} />
              <Route path="check-in" element={<Reservations filter="checkin" />} />
              
              {/* Tariff Routes */}
              <Route path="accessories" element={<Accessories />} />
              <Route path="plans" element={<Optionals />} />
              <Route path="fares" element={<Optionals />} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="performance" element={<Performance />} />
              
              {/* Marketing Routes */}
              <Route path="offers" element={<Offers />} />
              <Route path="automations" element={<Automations />} />
              
              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRoutes;