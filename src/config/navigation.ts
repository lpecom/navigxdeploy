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
  Clock,
  CalendarCheck,
  CalendarClock,
  LineChart,
  BarChart,
  PieChart,
  Megaphone,
  Settings,
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
    label: "Agenda",
    subItems: [
      { to: "/admin/calendar", icon: CalendarCheck, label: "Calendário" },
      { to: "/admin/reservations/pending", icon: Clock, label: "Pendentes" },
      { to: "/admin/reservations/pickup", icon: CarFront, label: "Retirada" },
      { to: "/admin/check-in", icon: CalendarClock, label: "Check-in" },
    ]
  },
  {
    icon: Car,
    label: "Frota",
    subItems: [
      { to: "/admin/vehicles/overview", icon: Grid, label: "Visão Geral" },
      { to: "/admin/vehicles/categories", icon: Tag, label: "Categorias" },
      { to: "/admin/vehicles/models", icon: Car, label: "Modelos" },
      { to: "/admin/vehicles/fleet", icon: CarFront, label: "Veículos" },
      { to: "/admin/vehicles/maintenance", icon: Wrench, label: "Manutenção" },
    ]
  },
  {
    icon: BarChart2,
    label: "Análises",
    subItems: [
      { to: "/admin/analytics", icon: LineChart, label: "Visão Geral" },
      { to: "/admin/reports", icon: BarChart, label: "Relatórios" },
      { to: "/admin/performance", icon: PieChart, label: "Performance" },
    ]
  },
  {
    icon: Tag,
    label: "Marketing",
    subItems: [
      { to: "/admin/offers", icon: Tag, label: "Ofertas" },
      { to: "/admin/automations", icon: Megaphone, label: "Automações" },
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