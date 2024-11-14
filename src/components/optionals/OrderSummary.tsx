import { Card } from "@/components/ui/card";

export const OrderSummary = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Rental Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pick-up</span>
              <span>21-11-2024, 8:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Return</span>
              <span>29-11-2024, 2:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span>8 days</span>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Location</h3>
          <div className="text-sm space-y-1">
            <p>Inwood, New York</p>
            <p>Sherman Ave 140</p>
            <p>10034 New York, NY</p>
            <p>United States</p>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Selected vehicle</span>
              <span>$246.00</span>
            </div>
            <div className="flex justify-between">
              <span>Security deposit</span>
              <span>$75.00</span>
            </div>
            <div className="flex justify-between">
              <span>After hours return fee</span>
              <span>$50.00</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-xl">$371.00</span>
          </div>
        </div>
      </div>
    </Card>
  );
};