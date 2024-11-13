import { DollarSign, Users, Car } from "lucide-react";

const StatsPanel = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$52,147",
      change: "+12%",
      icon: DollarSign,
    },
    {
      label: "Active Rentals",
      value: "32",
      change: "+4%",
      icon: Car,
    },
    {
      label: "Total Customers",
      value: "24",
      change: "+7%",
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-lg border border-gray-200 animate-fade-in"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;