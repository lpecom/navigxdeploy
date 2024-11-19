import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MenuItem } from "@/config/navigation";

interface SidebarMenuProps {
  items: MenuItem[];
  currentPath: string;
}

export const SidebarMenu = ({ items, currentPath }: SidebarMenuProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Check if a path is active, including parent paths
  const isActive = (path?: string) => {
    if (!path) return false;
    
    // Special case for dashboard - only active when exact match
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    
    // For other routes, check if current path starts with the route path
    if (currentPath === path) return true;
    return currentPath.startsWith(path + '/');
  };

  // Auto-expand parent menu when child route is active
  useEffect(() => {
    items.forEach(item => {
      if (item.subItems?.some(subItem => isActive(subItem.to))) {
        setOpenMenus(prev => prev.includes(item.label) ? prev : [...prev, item.label]);
      }
    });
  }, [currentPath, items]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isMenuActive = item.subItems?.some(subItem => isActive(subItem.to)) || isActive(item.to);
    const isOpen = openMenus.includes(item.label);

    if (item.subItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors",
              isMenuActive
                ? "text-primary bg-primary/5 font-medium"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
            {isOpen ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          {isOpen && (
            <div className="mt-1 ml-4 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.to}
                  to={subItem.to || "#"}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                    isActive(subItem.to)
                      ? "text-primary bg-primary/5 font-medium"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.to || "#"}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors",
          isActive(item.to)
            ? "text-primary bg-primary/5 font-medium"
            : "text-gray-600 hover:text-primary hover:bg-primary/5"
        )}
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="px-3 py-4 space-y-1">
      {items.map(renderMenuItem)}
    </nav>
  );
};