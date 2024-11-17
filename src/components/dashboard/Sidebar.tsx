import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Car,
  BarChart2,
  FileText,
  Package,
  Tag,
  ChevronDown,
  ChevronRight,
  Users,
  Globe,
  Wrench,
  CarFront,
  Grid,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/customers", icon: Users, label: "Clientes" },
  {
    icon: Calendar,
    label: "Reservas",
    subItems: [
      { to: "/admin/reservations/pending", label: "Pendentes" },
      { to: "/admin/reservations/pickup", label: "Retirada" },
      { to: "/admin/check-in", label: "Check-in" },
    ]
  },
  {
    icon: Car,
    label: "Frota",
    subItems: [
      { to: "/admin/vehicles/overview", label: "Visão Geral", icon: Grid },
      { to: "/admin/vehicles/categories", label: "Categorias", icon: Tag },
      { to: "/admin/vehicles/models", label: "Modelos", icon: CarFront },
      { to: "/admin/vehicles/fleet", label: "Veículos", icon: Car },
      { to: "/admin/vehicles/maintenance", label: "Manutenção", icon: Wrench },
    ]
  },
  {
    icon: BarChart2,
    label: "Análises",
    subItems: [
      { to: "/admin/analytics", label: "Visão Geral" },
      { to: "/admin/reports", label: "Relatórios" },
      { to: "/admin/performance", label: "Performance" },
    ]
  },
  {
    icon: Tag,
    label: "Marketing",
    subItems: [
      { to: "/admin/offers", label: "Ofertas" },
      { to: "/admin/automations", label: "Automações" },
    ]
  },
  { to: "/admin/accessories", icon: Package, label: "Opcionais" },
  { to: "/admin/website-settings", icon: Globe, label: "Website" },
];

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: any) => {
    if (item.subItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors",
              openMenus.includes(item.label)
                ? "text-primary bg-primary/5"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
            {openMenus.includes(item.label) ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          {openMenus.includes(item.label) && (
            <div className="mt-1 ml-4 space-y-1">
              {item.subItems.map((subItem: any) => (
                <Link
                  key={subItem.to}
                  to={subItem.to}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                    isActive(subItem.to)
                      ? "text-primary bg-primary/5 font-medium"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {subItem.icon && <subItem.icon className="w-4 h-4 mr-2" />}
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.to}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors",
          isActive(item.to)
            ? "text-primary bg-primary/5 font-medium"
            : "text-gray-600 hover:text-primary hover:bg-primary/5"
        )}
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-6">
        <img 
          src="https://i.imghippo.com/files/uafE3798xA.png" 
          alt="Navig Logo" 
          className="h-8 w-auto"
        />
      </div>
      <nav className="px-3 py-4 space-y-1">
        {menuItems.map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default Sidebar;