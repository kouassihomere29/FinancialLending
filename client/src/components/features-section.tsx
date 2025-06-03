import { Zap, Shield, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Réponse instantanée",
      description: "Obtenez une réponse de principe en moins de 5 minutes grâce à notre système d'évaluation automatisé.",
      bgColor: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      icon: Shield,
      title: "100% sécurisé",
      description: "Vos données sont chiffrées et protégées. Nous respectons la réglementation RGPD.",
      bgColor: "bg-green-100",
      iconColor: "text-success",
    },
    {
      icon: Heart,
      title: "Sans engagement",
      description: "La simulation est gratuite et sans engagement. Vous pouvez annuler à tout moment.",
      bgColor: "bg-yellow-100",
      iconColor: "text-warning",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir MoneyFlow ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des avantages uniques pour votre tranquillité d'esprit
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className={`${feature.iconColor} text-xl`} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
