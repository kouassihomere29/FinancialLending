import { Calculator, FileText, Search, Send, MessageSquare, UserCheck, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      icon: Calculator,
      title: "1. Simulez votre prêt",
      description: "Utilisez notre simulateur pour calculer votre prêt et connaître vos mensualités en temps réel.",
    },
    {
      icon: FileText,
      title: "2. Soumettez votre projet",
      description: "Remplissez votre demande en ligne en quelques minutes. Vos données sont 100% sécurisées.",
    },
    {
      icon: Search,
      title: "3. Analyse & validation du dossier",
      description: "Notre équipe analyse votre dossier et vérifie vos informations pour une validation complète.",
    },
    {
      icon: Send,
      title: "4. Nous soumettons votre dossier au prêteur",
      description: "Votre dossier validé est transmis à notre réseau de prêteurs partenaires pour évaluation.",
    },
    {
      icon: MessageSquare,
      title: "5. Réponse du prêteur",
      description: "Réponse du prêteur avec proposition d'un plan de remboursement en cas d'acceptation par le prêteur.",
    },
    {
      icon: UserCheck,
      title: "6. Ouverture d'un compte chez le prêteur",
      description: "Ouverture d'un compte chez le prêteur après validation de votre dossier.",
    },
    {
      icon: DollarSign,
      title: "7. Fonds virés sur votre compte",
      description: "Fonds virés sur votre compte après acceptation par le prêteur.",
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
            Un processus simple et transparent en 7 étapes
          </p>
        </div>
        <div className="grid lg:grid-cols-4 xl:grid-cols-4 gap-6">
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
