import { Car } from "lucide-react";

const RentalsList = () => {
  const rentals = [
    {
      id: "1",
      customer: "Chris Evans",
      vehicle: "Toyota Avalon",
      status: "active",
      startDate: "24 Jun 2024",
      endDate: "30 Jun 2024",
    },
    {
      id: "2",
      customer: "Sarah Johnson",
      vehicle: "Honda Civic",
      status: "scheduled",
      startDate: "25 Jun 2024",
      endDate: "28 Jun 2024",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Recent Rentals</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {rentals.map((rental) => (
          <div key={rental.id} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{rental.customer}</p>
                <p className="text-sm text-gray-500">{rental.vehicle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">{rental.startDate}</p>
                <p className="text-sm text-gray-500">{rental.endDate}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rental.status === "active"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {rental.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalsList;