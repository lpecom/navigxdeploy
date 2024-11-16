import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Car,
  Wrench,
  CreditCard,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

interface DriverSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const DriverSidebar = ({ isOpen, onToggle }: DriverSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const navItems: NavItem[] = [
    { icon: Car, label: "Meu Veículo", href: "/driver" },
    { icon: Wrench, label: "Manutenção", href: "/driver/maintenance" },
    { icon: CreditCard, label: "Pagamentos", href: "/driver/payments" },
    { icon: MessageSquare, label: "Suporte", href: "/driver/support" },
    { icon: Settings, label: "Configurações", href: "/driver/settings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !isOpen && !isHovered && "lg:w-20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className={cn(
              "transition-all duration-300",
              !isOpen && !isHovered ? "w-8" : "w-24"
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                "hover:bg-gray-100 hover:text-gray-900",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700",
                !isOpen && !isHovered && "justify-center lg:px-3"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                !isOpen && !isHovered ? "mr-0" : "mr-3"
              )} />
              <span className={cn(
                "transition-opacity duration-300",
                !isOpen && !isHovered ? "lg:hidden" : "block"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
              !isOpen && !isHovered && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn(
              "w-5 h-5",
              !isOpen && !isHovered ? "mr-0" : "mr-3"
            )} />
            <span className={cn(
              "transition-opacity duration-300",
              !isOpen && !isHovered ? "lg:hidden" : "block"
            )}>
              Sair
            </span>
          </Button>
        </div>

        {/* Toggle button (desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-4 top-10 hidden lg:flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-md"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </aside>
    </>
  );
};