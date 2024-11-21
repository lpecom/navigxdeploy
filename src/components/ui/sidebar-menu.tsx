import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface MenuItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarMenuProps {
  items: MenuItem[];
  currentPath: string;
}

export function SidebarMenu({ items, currentPath }: SidebarMenuProps) {
  const isActive = (href: string) => {
    if (href === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(href) && href !== '/admin';
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const active = isActive(item.href);
        
        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors relative group",
              active
                ? "text-primary-600 bg-primary-50 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
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
      })}
    </div>
  );
}