export default function TrustIndicators() {
  const indicators = [
    { value: "98%", label: "Clients satisfaits" },
    { value: "5 min", label: "Temps de réponse" },
    { value: "50k+", label: "Prêts accordés" },
    { value: "24/7", label: "Service client" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {indicators.map((indicator, index) => (
            <div key={index} className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">
                {indicator.value}
              </div>
              <div className="text-sm text-gray-600">
                {indicator.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
