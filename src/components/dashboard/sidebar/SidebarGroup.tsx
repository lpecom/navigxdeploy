import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SidebarGroupProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

export const SidebarGroup = ({ icon: Icon, label, children }: SidebarGroupProps) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 ml-auto" />
      </div>
      <div className="sidebar-submenu">
        {children}
      </div>
    </div>
  );
};