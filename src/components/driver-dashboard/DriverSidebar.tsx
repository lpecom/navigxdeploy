import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  CreditCard,
  Tag,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
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

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/driver" },
    { icon: Car, label: "Meu Veículo", href: "/driver/vehicle" },
    { icon: Calendar, label: "Minhas Reservas", href: "/driver/reservations" },
    { icon: CreditCard, label: "Financeiro", href: "/driver/financial" },
    { icon: Tag, label: "Promoções", href: "/driver/promotions" },
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
          "fixed lg:sticky top-0 left-0 z-50 flex h-screen w-72 flex-col bg-white border-r border-gray-200 lg:shadow-none transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute right-4 top-4 lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </aside>
    </>
  );
};