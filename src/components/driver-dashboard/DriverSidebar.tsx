import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { driverMenuItems } from "@/config/navigation";

interface DriverSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const DriverSidebar = ({ isOpen, onToggle }: DriverSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-white border-r border-gray-200",
          "transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-8 w-auto"
          />
        </div>

        <SidebarMenu items={driverMenuItems} currentPath={location.pathname} />

        <div className="p-4 mt-auto border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
};