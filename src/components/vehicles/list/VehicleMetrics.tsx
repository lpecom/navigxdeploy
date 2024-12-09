import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  comparedText?: string;
  chart?: React.ReactNode;
}

const MetricCard = ({ title, value, change, comparedText = "Compared to last week", chart }: MetricCardProps) => {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold">{value}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {change}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{comparedText}</p>
          </div>
          {chart && <div className="w-24 h-12">{chart}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export const VehicleMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <MetricCard
        title="Total Product"
        value="201"
        change="+12 product"
      />
      <MetricCard
        title="Product Revenue"
        value="$20,432"
        change="+5%"
      />
      <MetricCard
        title="Product Sold"
        value="3,899"
        change="+2%"
      />
    </div>
  );
};