import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Car,
  BarChart2,
  FileText,
  Gauge,
  Package,
  Cog,
  Tag
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/reservations", icon: Calendar, label: "Reservations" },
    { to: "/vehicles", icon: Car, label: "Vehicles" },
    { to: "/analytics", icon: BarChart2, label: "Analytics" },
    { to: "/reports", icon: FileText, label: "Reports" },
    { to: "/performance", icon: Gauge, label: "Performance" },
    { to: "/optionals", icon: Package, label: "Optionals" },
    { to: "/automations", icon: Cog, label: "Automations" },
    { to: "/offers", icon: Tag, label: "Offers" },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <img src="/src/assets/navig-logo.png" alt="Logo" className="h-8" />
      </div>
      <nav className="mt-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-6 py-3 text-sm ${
                isActive(link.to)
                  ? "text-primary bg-primary/5 border-r-2 border-primary"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;