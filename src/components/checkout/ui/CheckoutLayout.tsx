import { ReactNode } from "react";
import { CheckoutHeader } from "./CheckoutHeader";
import { AnnouncementBar } from "./AnnouncementBar";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export const CheckoutLayout = ({ children }: CheckoutLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBar />
      <CheckoutHeader />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};