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
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  to: string;
  label: string;
}

interface MenuItem {
  icon: any;
  label: string;
  to?: string;
  subItems?: SubMenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      icon: Calendar,
      label: "Reservas",
      subItems: [
        { to: "/reservations/pending", label: "Pendentes" },
        { to: "/reservations/pickup", label: "Retirada" },
      ]
    },
    {
      icon: Car,
      label: "Veículos",
      subItems: [
        { to: "/vehicles/fleet", label: "Frota" },
        { to: "/vehicles/rentals", label: "Locações" },
        { to: "/vehicles/customers", label: "Clientes" },
      ]
    },
    {
      icon: BarChart2,
      label: "Análises",
      subItems: [
        { to: "/analytics", label: "Visão Geral" },
        { to: "/reports", label: "Relatórios" },
        { to: "/performance", label: "Performance" },
      ]
    },
    {
      icon: Tag,
      label: "Marketing",
      subItems: [
        { to: "/offers", label: "Ofertas" },
        { to: "/automations", label: "Automações" },
      ]
    },
    { to: "/accessories", icon: Package, label: "Opcionais" },
    {
      icon: Settings,
      label: "Configurações",
      subItems: [
        { to: "/settings/profile", label: "Perfil" },
        { to: "/settings/company", label: "Empresa" },
        { to: "/settings/integrations", label: "Integrações" },
      ]
    },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <img 
          src="https://i.imghippo.com/files/uafE3798xA.png" 
          alt="Navig Logo" 
          className="h-8 w-auto mx-auto"
        />
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "w-full flex items-center px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-primary/5",
                    openMenus.includes(item.label) && "text-primary bg-primary/5"
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
                  <div className="bg-gray-50">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        className={cn(
                          "flex items-center pl-14 pr-6 py-2 text-sm",
                          isActive(subItem.to)
                            ? "text-primary bg-primary/5 border-r-2 border-primary"
                            : "text-gray-600 hover:text-primary hover:bg-primary/5"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.to!}
                className={cn(
                  "flex items-center px-6 py-3 text-sm",
                  isActive(item.to!)
                    ? "text-primary bg-primary/5 border-r-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;