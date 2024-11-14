import { Car, ChartBar, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import navigLogo from "@/assets/navig-logo.png";

const Sidebar = () => {
  const menuItems = [
    { icon: ChartBar, label: "Dashboard", active: true },
    { icon: Car, label: "Vehicles" },
    { icon: Users, label: "Customers" },
    { icon: Calendar, label: "Schedule" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <img src={navigLogo} alt="Navig Logo" className="h-8" />
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;