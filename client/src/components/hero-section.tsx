import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle, Shield, Clock } from "lucide-react";
import LoanCalculator from "./loan-calculator";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const element = document.getElementById("application");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = "/auth";
    }
  };

  const scrollToCalculator = () => {
    const element = document.getElementById("calculator");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="gradient-primary text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Financez votre projet quelques soit le besoin,{" "}
              <span className="text-yellow-300">Obtenez votre prêt en moins de 2 mois grâce à nos partenaires financiers</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Solution de prêt rapide, simple, flexible et 100% en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={scrollToCalculator}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Simuler mon prêt
              </Button>
              <Button 
                onClick={handleGetStarted}
                variant="outline"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
              >
                {isAuthenticated ? "Demander maintenant" : "Se connecter"}
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="text-success mr-2 h-5 w-5" />
                <span>Réponse immédiate</span>
              </div>
              <div className="flex items-center">
                <Shield className="text-success mr-2 h-5 w-5" />
                <span>100% sécurisé</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-success mr-2 h-5 w-5" />
                <span>24h/24</span>
              </div>
            </div>
          </div>
          <div className="animate-fade-in">
            <LoanCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
