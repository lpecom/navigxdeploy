import { Link, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { adminMenuItems } from "@/config/navigation";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-6">
        <img 
          src="https://i.imghippo.com/files/uafE3798xA.png" 
          alt="Navig Logo" 
          className="h-8 w-auto"
        />
      </div>
      <SidebarMenu items={adminMenuItems} currentPath={location.pathname} />
    </aside>
  );
};

export default Sidebar;