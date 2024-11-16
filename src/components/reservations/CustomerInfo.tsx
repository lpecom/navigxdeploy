interface Customer {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at: string;
  total_rentals: number;
  last_rental_date?: string;
  status: string;
}

interface CustomerInfoProps {
  customer: Customer;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Nome Completo</p>
        <p className="font-medium">{customer.full_name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">CPF</p>
        <p className="font-medium">{customer.cpf}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{customer.email}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Telefone</p>
        <p className="font-medium">{customer.phone}</p>
      </div>
      {customer.address && (
        <div>
          <p className="text-sm text-muted-foreground">Endereço</p>
          <p className="font-medium">{customer.address}</p>
          <p className="font-medium">
            {customer.city}, {customer.state} - {customer.postal_code}
          </p>
        </div>
      )}
    </div>
  );
};