import { 
  LayoutDashboard, 
  Calendar, 
  Car, 
  CreditCard, 
  TicketCheck,
  Users,
  Settings,
  FileText,
  MapPin,
  Clock,
  AlertTriangle,
  Banknote,
  Receipt,
  Shield
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
        { label: "Analytics", icon: FileText },
        { label: "Reports", icon: FileText },
        { label: "Performance", icon: Clock }
      ]
    },
    { 
      icon: Calendar, 
      label: "Bookings",
      path: "/reservations",
      active: location.pathname === "/reservations",
      subItems: [
        { label: "Active Rentals", icon: Clock },
        { label: "Reservations", icon: Calendar },
        { label: "History", icon: FileText }
      ]
    },
    { 
      icon: Car, 
      label: "Vehicles",
      subItems: [
        { label: "Fleet Overview", icon: Car },
        { label: "Maintenance", icon: Settings },
        { label: "Location", icon: MapPin },
        { label: "Insurance", icon: Shield }
      ]
    },
    { 
      icon: CreditCard, 
      label: "Charges",
      subItems: [
        { label: "Payments", icon: Banknote },
        { label: "Invoices", icon: Receipt },
        { label: "Pricing", icon: CreditCard }
      ]
    },
    { 
      icon: TicketCheck, 
      label: "Tickets",
      subItems: [
        { label: "Support", icon: Users },
        { label: "Issues", icon: AlertTriangle },
        { label: "Feedback", icon: FileText }
      ]
    },
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
              <a
                href="#"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-accent hover:text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            )}
            
            {item.subItems && (
              <div className="ml-9 space-y-1">
                {item.subItems.map((subItem) => (
                  <a
                    key={subItem.label}
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-primary transition-colors rounded-lg"
                  >
                    <subItem.icon className="w-4 h-4" />
                    {subItem.label}
                  </a>
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