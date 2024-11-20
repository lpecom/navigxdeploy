import { Link, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { adminMenuItems } from "@/config/navigation";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-8 border-b border-gray-200">
        <img 
          src="https://i.imghippo.com/files/uafE3798xA.png" 
          alt="Navig Logo" 
          className="h-8 w-auto"
        />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        <SidebarMenu items={adminMenuItems} currentPath={location.pathname} />
      </div>
    </aside>
  );
};

export default Sidebar;