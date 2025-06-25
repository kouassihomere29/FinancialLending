import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import LoanCalculator from "@/components/loan-calculator";
import TrustIndicators from "@/components/trust-indicators";
import HowItWorks from "@/components/how-it-works";
import ProcessSimulator from "@/components/process-simulator";
import LoanApplicationForm from "@/components/loan-application-form";
import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <LoanCalculator />
      <FeaturesSection />
      <HowItWorks />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simulateur de processus
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualisez en temps réel comment votre demande sera traitée
            </p>
          </div>
          <ProcessSimulator />
        </div>
      </section>
      <TrustIndicators />
      <LoanApplicationForm />
      <FAQSection />
      <Footer />
    </div>
  );
}
