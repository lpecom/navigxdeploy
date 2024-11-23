import { Link, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { adminMenuItems } from "@/config/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link to="/admin" className="flex items-center" onClick={onClose}>
            <img 
              src="https://i.imghippo.com/files/uafE3798xA.png" 
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          <SidebarMenu 
            items={adminMenuItems} 
            currentPath={location.pathname}
            onItemClick={onClose}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;