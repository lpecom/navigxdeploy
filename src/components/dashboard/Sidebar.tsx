import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  CarFront,
  DollarSign,
  BarChart2,
  Tags,
  Globe,
  ScrollText,
  ChevronDown,
  FileCheck
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-[#0F172A] border-r border-gray-800">
      <div className="p-6">
        <img src="/navig-logo.png" alt="Navig" className="h-8" />
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
              isActive && "bg-gray-800 text-white"
            )
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
              isActive && "bg-gray-800 text-white"
            )
          }
        >
          <Users className="h-5 w-5" />
          <span>Clientes</span>
        </NavLink>

        <div className="py-2">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span>Reservas</span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </div>
          
          <div className="pl-11 space-y-1 mt-1">
            <NavLink
              to="/admin/reservations"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Aprovações</span>
            </NavLink>
            
            <NavLink
              to="/admin/pickup"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Retirada</span>
            </NavLink>
            
            <NavLink
              to="/admin/check-in"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Check-in</span>
            </NavLink>
          </div>
        </div>

        <NavLink
          to="/admin/fleet"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
              isActive && "bg-gray-800 text-white"
            )
          }
        >
          <CarFront className="h-5 w-5" />
          <span>Frota</span>
        </NavLink>

        <div className="py-2">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
            <DollarSign className="h-5 w-5" />
            <span>Tarifas</span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </div>
          
          <div className="pl-11 space-y-1 mt-1">
            <NavLink
              to="/admin/plans"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Planos</span>
            </NavLink>
            
            <NavLink
              to="/admin/optionals"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Opcionais</span>
            </NavLink>
          </div>
        </div>

        <div className="py-2">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
            <BarChart2 className="h-5 w-5" />
            <span>Análises</span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </div>
          
          <div className="pl-11 space-y-1 mt-1">
            <NavLink
              to="/admin/performance"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Performance</span>
            </NavLink>
            
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Relatórios</span>
            </NavLink>
          </div>
        </div>

        <div className="py-2">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
            <Tags className="h-5 w-5" />
            <span>Marketing</span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </div>
          
          <div className="pl-11 space-y-1 mt-1">
            <NavLink
              to="/admin/offers"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Ofertas</span>
            </NavLink>
            
            <NavLink
              to="/admin/automations"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
                  isActive && "bg-gray-800 text-white"
                )
              }
            >
              <span>Automações</span>
            </NavLink>
          </div>
        </div>

        <NavLink
          to="/admin/website"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
              isActive && "bg-gray-800 text-white"
            )
          }
        >
          <Globe className="h-5 w-5" />
          <span>Website</span>
        </NavLink>

        <NavLink
          to="/admin/changelog"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white",
              isActive && "bg-gray-800 text-white"
            )
          }
        >
          <ScrollText className="h-5 w-5" />
          <span>Changelog</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;