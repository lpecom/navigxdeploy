import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

export const QuickStatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  gradient,
  iconColor
}: QuickStatsCardProps) => {
  return (
    <Card className={`${gradient} border-none`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-secondary-900/80">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${iconColor}`}>{value}</div>
        <p className="text-xs text-secondary-600 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};