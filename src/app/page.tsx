import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import PricingSection from "@/components/landing/PricingSection";
import ClientsSection from "@/components/landing/ClientsSection";
import ContactSection from "@/components/landing/ContactSection";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Cardápio Digital SaaS - Transforme seu Restaurante",
  description: "Plataforma completa de cardápio digital e gestão para restaurantes. Sistema SaaS moderno, intuitivo e poderoso.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LandingNav />
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <ClientsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
