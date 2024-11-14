import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderSummary } from "@/components/optionals/OrderSummary";
import { OptionalsList } from "@/components/optionals/OptionalsList";

const Optionals = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Optional Extras</h1>
          <OptionalsList />
          <div className="flex justify-between mt-8">
            <Link to="/vehicle-selection">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Link to="/driver-details">
              <Button className="flex items-center gap-2">
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
        
        <div className="space-y-6">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Optionals;