import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ThermometerSnowflake, ThermometerSun, User, FileText, Shield } from "lucide-react";

interface ReservationDetailsProps {
  reservationId: string;
}

const ReservationDetails = ({ reservationId }: ReservationDetailsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reservation Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
            <div className="space-y-1">
              <p className="text-sm">John Doe</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
              <p className="text-sm text-muted-foreground">(555) 123-4567</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Risk Assessment</h3>
            <div className="space-y-2">
              <Badge className="bg-success text-white flex gap-1 items-center w-fit">
                <ThermometerSnowflake className="w-4 h-4" />
                Low Risk
              </Badge>
              <Progress value={25} className="h-2" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Documents</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm">Driver's License Verified</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-success" />
                <span className="text-sm">Insurance Documents Complete</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDetails;