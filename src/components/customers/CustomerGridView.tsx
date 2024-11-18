import { CustomerCard } from "./CustomerCard"

interface CustomerGridViewProps {
  customers: any[]
  expandedCustomerId: string | null
  onToggleExpand: (id: string) => void
  onViewDetails: (id: string) => void
}

export const CustomerGridView = ({ 
  customers, 
  expandedCustomerId, 
  onToggleExpand, 
  onViewDetails 
}: CustomerGridViewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {customers?.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isExpanded={expandedCustomerId === customer.id}
          onToggle={() => onToggleExpand(customer.id)}
          onViewDetails={() => onViewDetails(customer.id)}
        />
      ))}
    </div>
  )
}