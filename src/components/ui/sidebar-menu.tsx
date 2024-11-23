import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
}

interface SidebarMenuProps {
  items: MenuItem[];
  currentPath: string;
  onItemClick?: () => void;
}

export function SidebarMenu({ items, currentPath, onItemClick }: SidebarMenuProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(href) && href !== '/admin';
  };

  const toggleSubmenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.href);
    const hasSubItems = item.items && item.items.length > 0;
    const isOpen = openMenus.includes(item.title);
    const isActiveParent = hasSubItems && item.items?.some(subItem => isActive(subItem.href));

    if (hasSubItems) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleSubmenu(item.title)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors relative w-full group",
              isActiveParent
                ? "text-primary-600 bg-primary-50 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActiveParent ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
            )}
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                isOpen ? "transform rotate-180" : ""
              )}
            />
          </button>
          {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {item.items?.map(subItem => renderMenuItem(subItem))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.href || '#'}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors relative group",
          active
            ? "text-primary-600 bg-primary-50 font-medium"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
        onClick={handleClick}
      >
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {item.icon && (
          <item.icon
            className={cn(
              "w-5 h-5",
              active ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
            )}
          />
        )}
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="space-y-1">
      {items.map(item => renderMenuItem(item))}
    </div>
  );
}