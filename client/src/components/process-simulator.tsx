import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, FileText, Search, Send, MessageSquare, UserCheck, DollarSign, PlayCircle, StopCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Simulez votre prêt",
    description: "Simulation de votre prêt personnel",
    icon: Calculator,
    duration: 1000,
  },
  {
    id: 2,
    title: "Soumettez votre projet",
    description: "Dossier de demande complet soumis",
    icon: FileText,
    duration: 2000,
  },
  {
    id: 3,
    title: "Analyse & validation du dossier",
    description: "Vérification et validation de votre dossier",
    icon: Search,
    duration: 3000,
  },
  {
    id: 4,
    title: "Soumission au prêteur",
    description: "Transmission à notre réseau de prêteurs",
    icon: Send,
    duration: 2000,
  },
  {
    id: 5,
    title: "Réponse du prêteur",
    description: "Décision et proposition de plan de remboursement",
    icon: MessageSquare,
    duration: 2500,
  },
  {
    id: 6,
    title: "Ouverture de compte",
    description: "Création de votre compte chez le prêteur",
    icon: UserCheck,
    duration: 2000,
  },
  {
    id: 7,
    title: "Virement des fonds",
    description: "Réception des fonds sur votre compte",
    icon: DollarSign,
    duration: 1500,
  },
];

export default function ProcessSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setCompletedSteps([]);
    
    let stepIndex = 0;
    
    const processStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentStep(step.id);
        
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id]);
          stepIndex++;
          
          if (stepIndex < steps.length) {
            setTimeout(processStep, 500);
          } else {
            setIsRunning(false);
            setCurrentStep(0);
          }
        }, step.duration);
      }
    };
    
    processStep();
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-6 w-6" />
          Simulation du processus de prêt
        </CardTitle>
        <CardDescription>
          Découvrez comment se déroule votre demande de prêt en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={startSimulation} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Lancer la simulation
          </Button>
          <Button 
            variant="outline" 
            onClick={stopSimulation} 
            disabled={!isRunning}
            className="flex items-center gap-2"
          >
            <StopCircle className="h-4 w-4" />
            Arrêter
          </Button>
        </div>

        {/* Progress */}
        {(isRunning || completedSteps.length > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        )}

        {/* Steps */}
        <div className="grid gap-4">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            const IconComponent = step.icon;
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  isCompleted ? "bg-green-50 border-green-200" :
                  isCurrent ? "bg-blue-50 border-blue-200 animate-pulse" :
                  "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-blue-100 text-blue-600" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isCompleted ? "text-green-900" :
                      isCurrent ? "text-blue-900" :
                      "text-gray-700"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      isCompleted ? "text-green-700" :
                      isCurrent ? "text-blue-700" :
                      "text-gray-500"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  <div>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                    )}
                    {isCurrent && (
                      <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}