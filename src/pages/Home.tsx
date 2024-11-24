import { Navigation } from "@/components/website/Navigation";
import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { HowItWorks } from "@/components/website/HowItWorks";
import { WhyChooseUs } from "@/components/website/WhyChooseUs";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { VehicleShowcase } from "@/components/home/VehicleShowcase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category: any) => {
    sessionStorage.setItem('selectedCategory', JSON.stringify(category));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <Hero />
      <VehicleShowcase onCategorySelect={handleCategorySelect} />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;