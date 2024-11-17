import { Link } from "react-router-dom";
import navigLogo from "@/assets/navig-logo.png";

export const CheckoutHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20">
        <div className="flex items-center justify-center h-full relative">
          <Link to="/" className="absolute left-0">
            <img 
              src={navigLogo}
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};