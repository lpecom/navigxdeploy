import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  iconColor,
}: QuickStatsCardProps) => {
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconColor.replace('text-', 'bg-')}/10`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Card>
  );
};