import { CustomerList } from "@/components/customers/CustomerList";

const Customers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
      </div>
      <CustomerList />
    </div>
  );
};

export default Customers;