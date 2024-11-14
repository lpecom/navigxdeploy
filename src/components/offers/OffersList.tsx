import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import type { Category, Offer } from "@/types/offers";

interface OffersListProps {
  selectedCategory: Category | null;
  offers: Offer[] | undefined;
  isLoading: boolean;
  onEditOffer: (offer: Offer) => void;
}

export const OffersList = ({
  selectedCategory,
  offers,
  isLoading,
  onEditOffer,
}: OffersListProps) => {
  if (isLoading) return <div>Loading offers...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedCategory
            ? `Offers in ${selectedCategory.name}`
            : "Select a category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCategory ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers?.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.name}</TableCell>
                  <TableCell>
                    {offer.price} / {offer.price_period}
                  </TableCell>
                  <TableCell>
                    {offer.is_active ? "Active" : "Hidden"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditOffer(offer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Select a category to view its offers
          </div>
        )}
      </CardContent>
    </Card>
  );
};