import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateLoan } from "@/lib/loan-calculator";
import { useAuth } from "@/hooks/useAuth";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(1500);
  const [duration, setDuration] = useState(6);
  const [calculation, setCalculation] = useState(calculateLoan(1500, 6));
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setCalculation(calculateLoan(amount, duration));
  }, [amount, duration]);

  const handleContinue = () => {
    if (isAuthenticated) {
      const element = document.getElementById("application");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Sauvegarder les paramètres du prêt et rediriger vers la connexion
      localStorage.setItem('loanParams', JSON.stringify({ amount, duration }));
      window.location.href = "/auth";
    }
  };

  return (
    <div id="calculator">
      <Card className="bg-white rounded-2xl shadow-2xl text-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Calculez votre prêt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant souhaité
            </label>
            <Slider
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              max={3000}
              min={500}
              step={50}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>500€</span>
              <span className="font-semibold text-primary text-lg">{amount}€</span>
              <span>3000€</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée de remboursement
            </label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez la durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 mois</SelectItem>
                <SelectItem value="6">6 mois</SelectItem>
                <SelectItem value="9">9 mois</SelectItem>
                <SelectItem value="12">12 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mensualité</span>
              <span className="text-xl font-bold text-primary">{calculation.monthlyPayment}€</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Coût total</span>
              <span>{calculation.totalCost}€</span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
          >
            {isAuthenticated ? "Faire ma demande" : "Se connecter pour continuer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
