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
      "Implementation of shadcn/ui components",
      "Database schema design and implementation",
      "Authentication system foundation",
      "Basic routing structure",
      "Project documentation setup",
      "Development environment configuration",
      "Git repository initialization"
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
      "Vehicle maintenance tracking system",
      "Vehicle image upload functionality",
      "Vehicle search and filtering",
      "Category management system",
      "Vehicle details page",
      "Maintenance history tracking",
      "Vehicle availability status system"
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
      "Integration with Uber API",
      "Driver documentation upload system",
      "Driver verification process",
      "License management system",
      "Driver dashboard implementation",
      "Profile editing capabilities",
      "Document validation system"
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
      "Payment history tracking",
      "Payment gateway integration",
      "Transaction monitoring system",
      "Payment receipt generation",
      "Refund processing system",
      "Payment method management",
      "Financial reporting system"
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
      "Rental period tracking",
      "Booking calendar implementation",
      "Reservation confirmation system",
      "Cancellation management",
      "Rental extension functionality",
      "Availability checker",
      "Booking conflict resolution"
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
      "Admin dashboard enhancements",
      "Content editor implementation",
      "Image management system",
      "SEO optimization tools",
      "Website analytics integration",
      "Performance monitoring",
      "Cache management system"
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
      "Customer analytics dashboard",
      "Customer support system",
      "Communication tools",
      "Customer feedback system",
      "Rating and review system",
      "Customer segmentation",
      "Loyalty program foundation"
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
      "Team contribution tracking",
      "Release notes system",
      "Development timeline",
      "Feature documentation",
      "Bug tracking integration",
      "Code review system",
      "Documentation generator"
    ]
  },
  {
    version: "1.0.8",
    date: "2024-03-23 10:00",
    developer: "Lucas Oliveira",
    type: "improvement",
    changes: [
      "Performance optimization phase 1",
      "Database query optimization",
      "Frontend caching implementation",
      "Image optimization system",
      "API response time improvements",
      "Code splitting implementation",
      "Bundle size optimization",
      "Memory usage optimization",
      "Database indexing improvements",
      "Cache invalidation system"
    ]
  },
  {
    version: "1.0.9",
    date: "2024-03-23 14:30",
    developer: "Pedro Mendes",
    type: "feature",
    changes: [
      "Reporting system implementation",
      "Analytics dashboard enhancement",
      "Custom report generator",
      "Data visualization tools",
      "Export functionality",
      "Report scheduling system",
      "KPI tracking implementation",
      "Revenue analytics",
      "Usage statistics",
      "Performance metrics"
    ]
  },
  {
    version: "1.1.0",
    date: "2024-03-23 17:00",
    developer: "Maria Silva",
    type: "improvement",
    changes: [
      "Security enhancements phase 1",
      "Authentication flow improvements",
      "Role-based access control",
      "Security audit implementation",
      "Password policy enforcement",
      "Two-factor authentication",
      "Session management improvements",
      "API security enhancements",
      "Data encryption implementation",
      "Security logging system"
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