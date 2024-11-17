import { Link } from "react-router-dom";

export const CheckoutHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center">
            <img 
              src="https://frxvpishprygdksbgziz.supabase.co/storage/v1/object/public/vehicle-images/navig-logo.png"
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};