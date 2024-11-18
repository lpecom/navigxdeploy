import {
  LayoutDashboard,
  Calendar,
  Car,
  BarChart2,
  FileText,
  Package,
  Tag,
  Users,
  Globe,
  Wrench,
  CarFront,
  Grid,
  History,
  AlertTriangle,
  Settings,
  ClipboardList,
} from "lucide-react";

export type MenuItem = {
  to?: string;
  icon: any;
  label: string;
  subItems?: MenuItem[];
};

export const adminMenuItems: MenuItem[] = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/customers", icon: Users, label: "Clientes" },
  {
    icon: Calendar,
    label: "Reservas",
    subItems: [
      { to: "/admin/reservations/pending", icon: ClipboardList, label: "Pendentes" },
      { to: "/admin/reservations/pickup", icon: Calendar, label: "Retirada" },
      { to: "/admin/check-in", icon: CarFront, label: "Check-in" },
    ]
  },
  {
    icon: Car,
    label: "Frota",
    subItems: [
      { to: "/admin/vehicles/overview", icon: Grid, label: "Dashboard da Frota" },
      { 
        icon: Settings, 
        label: "Configurações",
        subItems: [
          { to: "/admin/vehicles/categories", icon: Tag, label: "Categorias" },
          { to: "/admin/vehicles/models", icon: CarFront, label: "Modelos" },
        ]
      },
      { to: "/admin/vehicles/fleet", icon: Car, label: "Veículos Ativos" },
      { 
        icon: Wrench,
        label: "Manutenção",
        subItems: [
          { to: "/admin/vehicles/maintenance", icon: AlertTriangle, label: "Pendentes" },
          { to: "/admin/vehicles/maintenance/history", icon: History, label: "Histórico" },
        ]
      },
    ]
  },
  {
    icon: BarChart2,
    label: "Análises",
    subItems: [
      { to: "/admin/analytics", icon: BarChart2, label: "Visão Geral" },
      { to: "/admin/reports", icon: FileText, label: "Relatórios" },
      { to: "/admin/performance", icon: BarChart2, label: "Performance" },
    ]
  },
  {
    icon: Tag,
    label: "Marketing",
    subItems: [
      { to: "/admin/offers", icon: Tag, label: "Ofertas" },
      { to: "/admin/automations", icon: Settings, label: "Automações" },
    ]
  },
  { to: "/admin/accessories", icon: Package, label: "Opcionais" },
  { to: "/admin/website-settings", icon: Globe, label: "Website" },
  { to: "/admin/changelog", icon: History, label: "Changelog" },
];

export const driverMenuItems: MenuItem[] = [
  { to: "/driver", icon: LayoutDashboard, label: "Visão Geral" },
  { to: "/driver/vehicle", icon: Car, label: "Meu Veículo" },
  { to: "/driver/reservations", icon: Calendar, label: "Minhas Reservas" },
  { to: "/driver/financial", icon: FileText, label: "Financeiro" },
  { to: "/driver/promotions", icon: Tag, label: "Promoções" },
];