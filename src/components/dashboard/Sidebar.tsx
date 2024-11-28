import {
  LayoutDashboard,
  Users,
  Calendar,
  CarFront,
  DollarSign,
  BarChart2,
  Tags,
  Globe,
  ScrollText
} from "lucide-react";
import { SidebarLink } from "./sidebar/SidebarLink";
import { SidebarGroup } from "./sidebar/SidebarGroup";
import { SidebarLogo } from "./sidebar/SidebarLogo";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SidebarLogo />
      
      <nav className="flex-1 space-y-1 px-4">
        <SidebarLink to="/admin" end icon={LayoutDashboard}>
          Dashboard
        </SidebarLink>

        <SidebarLink to="/admin/customers" icon={Users}>
          Clientes
        </SidebarLink>

        <SidebarGroup icon={Calendar} label="Reservas">
          <SidebarLink to="/admin/reservations">Aprovações</SidebarLink>
          <SidebarLink to="/admin/pickup">Retirada</SidebarLink>
          <SidebarLink to="/admin/check-in">Check-in</SidebarLink>
        </SidebarGroup>

        <SidebarLink to="/admin/fleet" icon={CarFront}>
          Frota
        </SidebarLink>

        <SidebarGroup icon={DollarSign} label="Tarifas">
          <SidebarLink to="/admin/plans">Planos</SidebarLink>
          <SidebarLink to="/admin/optionals">Opcionais</SidebarLink>
        </SidebarGroup>

        <SidebarGroup icon={BarChart2} label="Análises">
          <SidebarLink to="/admin/performance">Performance</SidebarLink>
          <SidebarLink to="/admin/reports">Relatórios</SidebarLink>
        </SidebarGroup>

        <SidebarGroup icon={Tags} label="Marketing">
          <SidebarLink to="/admin/offers">Ofertas</SidebarLink>
          <SidebarLink to="/admin/automations">Automações</SidebarLink>
        </SidebarGroup>

        <SidebarLink to="/admin/website" icon={Globe}>
          Website
        </SidebarLink>

        <SidebarLink to="/admin/changelog" icon={ScrollText}>
          Changelog
        </SidebarLink>
      </nav>
    </div>
  );
};

export default Sidebar;