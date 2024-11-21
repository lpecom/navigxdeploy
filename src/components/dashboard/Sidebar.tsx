import { Link, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar-menu";
import { adminMenuItems } from "@/config/navigation";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 z-50">
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <Link to="/admin" className="flex items-center">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-7 w-auto"
          />
        </Link>
      </div>
      <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-4">
        <SidebarMenu items={adminMenuItems} currentPath={location.pathname} />
      </nav>
    </aside>
  );
};

export default Sidebar;