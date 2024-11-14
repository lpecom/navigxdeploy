import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, ThermometerSnowflake, ThermometerSun, User, FileText } from "lucide-react";
import ReservationsList from "@/components/reservations/ReservationsList";
import ReservationDetails from "@/components/reservations/ReservationDetails";
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Reservations = () => {
  const { toast } = useToast();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      // This would be replaced with your actual API call
      const response = await fetch("/api/reservations");
      if (!response.ok) {
        toast({
          title: "Error fetching reservations",
          description: "Please try again later",
          variant: "destructive",
        });
        throw new Error("Failed to fetch reservations");
      }
      return response.json();
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <NavigationMenu className="mb-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md">
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/reservations" className="px-4 py-2 hover:bg-accent rounded-md">
              Reservations
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <Badge variant="outline" className="px-4 py-1">
          {isLoading ? "Loading..." : `${reservations?.length || 0} Active Leads`}
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <ReservationsList />
        </TabsContent>
        <TabsContent value="pending">
          <ReservationsList filter="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <ReservationsList filter="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <ReservationsList filter="rejected" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;