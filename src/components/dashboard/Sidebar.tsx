import { 
  LayoutDashboard, 
  BarChart, 
  FileText,
  TrendingUp,
  UserPlus,
  Truck,
  Calendar,
  History,
  Gift,
  ClipboardList,
  Megaphone,
  LayoutTemplate,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard",
      path: "/",
      active: location.pathname === "/",
      subItems: [
        { label: "Analytics", icon: BarChart, path: "/analytics" },
        { label: "Relatórios", icon: FileText, path: "/reports" },
        { label: "Performance", icon: TrendingUp, path: "/performance" }
      ]
    },
    { 
      icon: UserPlus, 
      label: "Leads",
      path: "/leads",
      active: location.pathname === "/leads",
      subItems: [
        { label: "Agendamentos", icon: Truck },
        { label: "Reservas", icon: Calendar, path: "/reservations" },
        { label: "Histórico", icon: History }
      ]
    },
    { 
      icon: Gift, 
      label: "Ofertas",
      path: "/offers",
      active: location.pathname === "/offers",
      subItems: [
        { label: "Formulários", icon: ClipboardList },
        { label: "Promoções", icon: Megaphone },
        { label: "Templates", icon: LayoutTemplate },
        { label: "Configurações", icon: Settings }
      ]
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <img src="https://i.imghippo.com/files/uafE3798xA.png" alt="Navig Logo" className="h-8" />
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.label} className="space-y-1">
            {item.path ? (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-accent hover:text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ) : (
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-accent hover:text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            )}
            
            {item.subItems && (
              <div className="ml-9 space-y-1">
                {item.subItems.map((subItem) => (
                  subItem.path ? (
                    <Link
                      key={subItem.label}
                      to={subItem.path}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-primary transition-colors rounded-lg"
                    >
                      <subItem.icon className="w-4 h-4" />
                      {subItem.label}
                    </Link>
                  ) : (
                    <div
                      key={subItem.label}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-primary transition-colors rounded-lg"
                    >
                      <subItem.icon className="w-4 h-4" />
                      {subItem.label}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;