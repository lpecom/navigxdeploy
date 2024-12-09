import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  image: string;
  name: string;
  variant: string;
  code: string;
  price: number;
  revenue: number;
  sales: number;
  stock: number;
  rating: number;
  status: "In Stock" | "Out of Stock" | "Restock";
}

const products: Product[] = [
  {
    id: "1",
    image: "/placeholder.svg",
    name: "Uxerflow T-Shirt",
    variant: "M - Black",
    code: "#B4092024",
    price: 1.40,
    revenue: 645.24,
    sales: 230,
    stock: 0,
    rating: 5.0,
    status: "Out of Stock"
  },
  // ... add more sample products
];

const StatusBadge = ({ status }: { status: Product["status"] }) => {
  const variants = {
    "In Stock": "bg-green-100 text-green-800",
    "Out of Stock": "bg-red-100 text-red-800",
    "Restock": "bg-yellow-100 text-yellow-800"
  };

  return (
    <Badge className={variants[status]}>
      {status}
    </Badge>
  );
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export const VehicleListTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead>Code Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.variant}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>${product.revenue.toFixed(2)}</TableCell>
              <TableCell>{product.sales} pcs</TableCell>
              <TableCell>{product.stock} pcs</TableCell>
              <TableCell>
                <RatingStars rating={product.rating} />
              </TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};