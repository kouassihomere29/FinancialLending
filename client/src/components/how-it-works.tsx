import { Edit, UserCheck, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      icon: Edit,
      title: "1. Simulez",
      description: "Utilisez notre simulateur pour calculer votre prêt et connaître vos mensualités en temps réel.",
    },
    {
      icon: UserCheck,
      title: "2. Demandez",
      description: "Remplissez votre demande en ligne en quelques minutes. Vos données sont 100% sécurisées.",
    },
    {
      icon: DollarSign,
      title: "3. Recevez",
      description: "Réponse immédiate et fonds virés sur votre compte dans les 24h après acceptation.",
      isSuccess: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un processus simple et transparent en 3 étapes
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${step.isSuccess ? 'bg-success' : 'bg-primary'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="text-white text-2xl" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
