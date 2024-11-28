import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  end?: boolean;
}

export const SidebarLink = ({ to, icon: Icon, children, end }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn("sidebar-link", isActive && "active")
      }
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </NavLink>
  );
};