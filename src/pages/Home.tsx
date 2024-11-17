import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;