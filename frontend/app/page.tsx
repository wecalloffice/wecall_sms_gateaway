import HeroSection from "@/components/ui/landing/HeroSection";
import { Navbar } from "@/components/ui/landing/Navbar";
import { FeaturesSection } from "@/components/ui/landing/FeaturesSection";
import { IntegrationsSection } from "@/components/ui/landing/IntegrationsSection";
import { PricingSection } from "@/components/ui/landing/PricingSection";
import { StatsSection } from "@/components/ui/landing/StatsSection";
import { TestimonialsSection } from "@/components/ui/landing/TestimonialsSection";
import { CTASection } from "@/components/ui/landing/CTASection";
import Footer from "@/components/ui/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
