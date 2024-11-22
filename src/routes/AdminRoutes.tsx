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
import CheckInList from "@/components/check-in/CheckInList";
import CheckInProcess from "@/components/check-in/CheckInProcess";

const AdminRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              {/* Root admin route redirects to dashboard */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Vehicle Routes */}
              <Route path="vehicles">
                <Route index element={<Navigate to="fleet" replace />} />
                <Route path="overview" element={<Vehicles view="overview" />} />
                <Route path="categories" element={<Vehicles view="categories" />} />
                <Route path="models" element={<Vehicles view="models" />} />
                <Route path="fleet" element={<Vehicles view="fleet" />} />
                <Route path="maintenance" element={<Vehicles view="maintenance" />} />
                <Route path=":id" element={<VehicleDetails />} />
              </Route>
              
              {/* Customer Routes */}
              <Route path="customers">
                <Route index element={<Customers />} />
                <Route path=":id" element={<CustomerDetails />} />
              </Route>
              
              {/* Reservation Routes */}
              <Route path="reservations">
                <Route index element={<Navigate to="pending" replace />} />
                <Route path="pending" element={<Reservations filter="pending" />} />
                <Route path="pickup" element={<Reservations filter="pickup" />} />
              </Route>

              {/* Check-in Routes */}
              <Route path="check-in">
                <Route index element={<CheckInList />} />
                <Route path=":id" element={<CheckInProcess />} />
              </Route>
              
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