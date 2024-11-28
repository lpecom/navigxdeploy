import { Link, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { adminMenuItems } from "@/config/navigation";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-30 h-full w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <Link to="/admin" className="flex items-center">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
        <SidebarMenu items={adminMenuItems} currentPath={location.pathname} />
      </div>
    </aside>
  );
};

export default Sidebar;