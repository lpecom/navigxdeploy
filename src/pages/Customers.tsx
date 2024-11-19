import { CustomerList } from "@/components/customers/CustomerList";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Customers = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <DashboardLayout
      title="Clientes"
      subtitle="Gerencie seus clientes e acompanhe suas atividades"
    >
      {isUploading && (
        <Progress value={progress} className="w-full" />
      )}
      <div className="bg-white rounded-lg border shadow-sm">
        <CustomerList />
      </div>
    </DashboardLayout>
  );
};

export default Customers;