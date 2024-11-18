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
      "Initial project setup and architecture",
      "Basic authentication system implementation",
      "Core dashboard layout"
    ]
  },
  {
    version: "1.0.1",
    date: "2024-03-19 10:15",
    developer: "João Santos",
    type: "feature",
    changes: [
      "Vehicle management system",
      "Fleet overview dashboard",
      "Vehicle categories and models"
    ]
  },
  {
    version: "1.0.2",
    date: "2024-03-20 16:45",
    developer: "Ana Costa",
    type: "improvement",
    changes: [
      "Enhanced reservation system",
      "Improved date picker component",
      "Added payment integration"
    ]
  },
  {
    version: "1.0.3",
    date: "2024-03-21 11:20",
    developer: "Lucas Oliveira",
    type: "fix",
    changes: [
      "Fixed authentication token refresh",
      "Resolved vehicle image upload issues",
      "Fixed reservation date validation"
    ]
  },
  {
    version: "1.0.4",
    date: "2024-03-22 15:00",
    developer: "Pedro Mendes",
    type: "feature",
    changes: [
      "Driver portal implementation",
      "Uber integration system",
      "Driver documentation upload"
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