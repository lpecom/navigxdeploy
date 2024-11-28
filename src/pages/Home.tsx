import { Navigation } from "@/components/website/Navigation";
import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { HowItWorks } from "@/components/website/HowItWorks";
import { WhyChooseUs } from "@/components/website/WhyChooseUs";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { VehicleShowcase } from "@/components/home/VehicleShowcase";
import { VehicleGroups } from "@/components/home/VehicleGroups";
import { PlateLookup } from "@/components/home/PlateLookup";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
      <Navigation />
      <Hero />
      <PlateLookup />
      <VehicleShowcase />
      <VehicleGroups />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;