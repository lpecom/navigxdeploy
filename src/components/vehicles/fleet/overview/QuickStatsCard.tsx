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
    <Card className={`${gradient} border-none shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-secondary-900/80">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${iconColor}`}>{value}</div>
        <p className="text-xs text-secondary-600 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};