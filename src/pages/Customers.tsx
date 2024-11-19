import { CustomerList } from "@/components/customers/CustomerList";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const Customers = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
      </div>
      {isUploading && (
        <Progress value={progress} className="w-full" />
      )}
      <CustomerList />
    </div>
  );
};

export default Customers;