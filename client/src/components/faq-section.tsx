import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Quels sont les conditions d'éligibilité ?",
      answer: "Pour être éligible, vous devez être majeur, résider en France, avoir des revenus réguliers d'au moins 1000€ nets par mois et ne pas être inscrit au FICP.",
    },
    {
      question: "Combien de temps pour recevoir les fonds ?",
      answer: "Notre processus en 7 étapes prend jusqu'à 2 mois avec nos partenaires financiers. Les fonds sont virés après validation complète du dossier et ouverture du compte chez le prêteur.",
    },
    {
      question: "Puis-je rembourser par anticipation ?",
      answer: "Oui, vous pouvez rembourser votre prêt par anticipation à tout moment, partiellement ou totalement, sans frais ni pénalités.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont chiffrées avec les dernières technologies de sécurité. Nous respectons strictement la réglementation RGPD.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <Button
                variant="ghost"
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left p-0 h-auto hover:bg-transparent"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`text-gray-400 transform transition-transform duration-200 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`} 
                  size={20}
                />
              </Button>
              {openFAQ === index && (
                <div className="mt-4 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
