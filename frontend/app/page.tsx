// import { Button } from "@/components/ui/button";

import { FeaturesSection } from "@/components/ui/landing/FeaturesSection";
import { Hero } from "@/components/ui/landing/Hero";
import { Navbar } from "@/components/ui/landing/Navbar";
import SendSmsForm from "@/features/sms/components/SendSmsForm";




export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-white flex flex-col">
      <Navbar />
      <Hero />
      <FeaturesSection />

    </main>
  );
}
