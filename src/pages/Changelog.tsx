import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChangelogEntry {
  version: string;
  date: string;
  developer: string;
  changes: string[];
  type: 'feature' | 'fix' | 'improvement';
}

const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2024-03-18 14:30",
    developer: "Maria Silva",
    type: "feature",
    changes: [
      "Initial project setup with Vite and React",
      "Integration with Supabase for backend services",
      "Basic project structure and routing setup",
      "Implementation of shadcn/ui components"
    ]
  },
  {
    version: "1.0.1",
    date: "2024-03-19 10:15",
    developer: "João Santos",
    type: "feature",
    changes: [
      "Vehicle management system implementation",
      "Car categories and models database structure",
      "Fleet management interface",
      "Vehicle maintenance tracking system"
    ]
  },
  {
    version: "1.0.2",
    date: "2024-03-20 16:45",
    developer: "Ana Costa",
    type: "feature",
    changes: [
      "Driver portal implementation",
      "Authentication system with Supabase",
      "Driver profile management",
      "Integration with Uber API"
    ]
  },
  {
    version: "1.0.3",
    date: "2024-03-21 11:20",
    developer: "Lucas Oliveira",
    type: "feature",
    changes: [
      "Payment system integration with Appmax",
      "Support for credit card, PIX, and boleto",
      "Invoice generation system",
      "Payment history tracking"
    ]
  },
  {
    version: "1.0.4",
    date: "2024-03-22 09:00",
    developer: "Pedro Mendes",
    type: "feature",
    changes: [
      "Reservation system implementation",
      "Check-in and check-out process",
      "Vehicle availability management",
      "Rental period tracking"
    ]
  },
  {
    version: "1.0.5",
    date: "2024-03-22 14:30",
    developer: "Maria Silva",
    type: "improvement",
    changes: [
      "Website settings management interface",
      "Dynamic content management",
      "Hero section customization",
      "Admin dashboard enhancements"
    ]
  },
  {
    version: "1.0.6",
    date: "2024-03-22 16:45",
    developer: "João Santos",
    type: "improvement",
    changes: [
      "Customer management system",
      "Customer profile tracking",
      "Rental history per customer",
      "Customer analytics dashboard"
    ]
  },
  {
    version: "1.0.7",
    date: "2024-03-22 18:00",
    developer: "Ana Costa",
    type: "feature",
    changes: [
      "Changelog implementation",
      "Development history tracking",
      "Version control documentation",
      "Team contribution tracking"
    ]
  }
];

const getTypeColor = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'feature':
      return 'text-green-600';
    case 'fix':
      return 'text-red-600';
    case 'improvement':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const Changelog = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Changelog</h1>
      <ScrollArea className="h-[800px] rounded-md border p-4">
        <div className="space-y-8">
          {changelogData.map((entry, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    Version {entry.version}
                    <span className={`ml-3 text-sm ${getTypeColor(entry.type)}`}>
                      {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </span>
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    {entry.date}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Developer: {entry.developer}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="text-gray-700">
                      {change}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Changelog;