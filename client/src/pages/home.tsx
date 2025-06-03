import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import TrustIndicators from "@/components/trust-indicators";
import HowItWorks from "@/components/how-it-works";
import LoanApplicationForm from "@/components/loan-application-form";
import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <TrustIndicators />
      <HowItWorks />
      <LoanApplicationForm />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
