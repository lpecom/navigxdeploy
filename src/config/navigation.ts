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
  DollarSign,
} from "lucide-react";

export type MenuItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
};

export const adminMenuItems: MenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Clientes", href: "/admin/customers", icon: Users },
  {
    title: "Reservas",
    icon: Calendar,
    items: [
      { title: "Pendentes", href: "/admin/reservations/pending", icon: Clock },
      { title: "Retirada", href: "/admin/reservations/pickup", icon: CalendarCheck },
      { title: "Check-in", href: "/admin/check-in", icon: CalendarClock },
    ]
  },
  {
    title: "Frota",
    icon: Car,
    items: [
      { title: "Visão Geral", href: "/admin/vehicles/overview", icon: Grid },
      { title: "Categorias", href: "/admin/vehicles/categories", icon: Tag },
      { title: "Modelos", href: "/admin/vehicles/models", icon: CarFront },
      { title: "Veículos", href: "/admin/vehicles/fleet", icon: Car },
      { title: "Manutenção", href: "/admin/vehicles/maintenance", icon: Wrench },
    ]
  },
  {
    title: "Tarifas",
    icon: DollarSign,
    items: [
      { title: "Opcionais", href: "/admin/accessories", icon: Package },
      { title: "Planos", href: "/admin/plans", icon: Tag },
      { title: "Condições", href: "/admin/fares", icon: DollarSign },
    ]
  },
  {
    title: "Análises",
    icon: BarChart2,
    items: [
      { title: "Visão Geral", href: "/admin/analytics", icon: LineChart },
      { title: "Relatórios", href: "/admin/reports", icon: BarChart },
      { title: "Performance", href: "/admin/performance", icon: PieChart },
    ]
  },
  {
    title: "Marketing",
    icon: Tag,
    items: [
      { title: "Ofertas", href: "/admin/offers", icon: Megaphone },
      { title: "Automações", href: "/admin/automations", icon: Settings },
    ]
  },
  { title: "Website", href: "/admin/website-settings", icon: Globe },
  { title: "Changelog", href: "/admin/changelog", icon: History },
];

export const driverMenuItems: MenuItem[] = [
  { title: "Visão Geral", href: "/driver", icon: LayoutDashboard },
  { title: "Meu Veículo", href: "/driver/vehicle", icon: Car },
  { title: "Minhas Reservas", href: "/driver/reservations", icon: Calendar },
  { title: "Financeiro", href: "/driver/financial", icon: FileText },
  { title: "Promoções", href: "/driver/promotions", icon: Tag },
];