import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, FileText, Search, Send, MessageSquare, UserCheck, DollarSign, PlayCircle, StopCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Simulez votre prêt", icon: Calculator, duration: 2000 },
  { id: 2, title: "Soumettez votre projet", icon: FileText, duration: 1000 },
  { id: 3, title: "Analyse & validation du dossier", icon: Search, duration: 4000 },
  { id: 4, title: "Soumission au prêteur", icon: Send, duration: 3000 },
  { id: 5, title: "Réponse du prêteur", icon: MessageSquare, duration: 3500 },
  { id: 6, title: "Ouverture de compte", icon: UserCheck, duration: 2500 },
  { id: 7, title: "Virement des fonds", icon: DollarSign, duration: 2000 },
];

const lenders = [
  { id: "BANK001", name: "Crédit Mutuel" },
  { id: "BANK002", name: "BNP Paribas" },
  { id: "BANK003", name: "Société Générale" },
];

interface AdminDemoProps {
  applicationId: number;
}

export default function AdminDemo({ applicationId }: AdminDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const advanceStepMutation = useMutation({
    mutationFn: async (step: number) => {
      return await apiRequest(`/api/loan-applications/${applicationId}/advance`, {
        method: "PATCH",
        body: JSON.stringify({ step }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", applicationId.toString()] });
    },
  });

  const assignLenderMutation = useMutation({
    mutationFn: async () => {
      const randomLender = lenders[Math.floor(Math.random() * lenders.length)];
      return await apiRequest(`/api/loan-applications/${applicationId}/assign-lender`, {
        method: "PATCH",
        body: JSON.stringify({ lenderId: randomLender.id, lenderName: randomLender.name }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", applicationId.toString()] });
    },
  });

  const lenderResponseMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/loan-applications/${applicationId}/lender-response`, {
        method: "PATCH",
        body: JSON.stringify({ 
          response: "approved", 
          message: "Votre demande a été approuvée. Félicitations ! Nous procédons maintenant à l'ouverture de votre compte." 
        }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", applicationId.toString()] });
    },
  });

  const setAccountMutation = useMutation({
    mutationFn: async () => {
      const accountNumber = `FR76 ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 3)}`;
      return await apiRequest(`/api/loan-applications/${applicationId}/account`, {
        method: "PATCH",
        body: JSON.stringify({ accountNumber }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", applicationId.toString()] });
    },
  });

  const startDemo = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setCompletedSteps([]);
    
    let stepIndex = 0;
    
    const processStep = async () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentStep(step.id);
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        // Perform backend action
        try {
          await advanceStepMutation.mutateAsync(step.id);
          
          // Special actions for certain steps
          if (step.id === 4) {
            await assignLenderMutation.mutateAsync();
          } else if (step.id === 5) {
            await lenderResponseMutation.mutateAsync();
          } else if (step.id === 6) {
            await setAccountMutation.mutateAsync();
          }
          
          setCompletedSteps(prev => [...prev, step.id]);
          stepIndex++;
          
          if (stepIndex < steps.length) {
            setTimeout(processStep, 1000);
          } else {
            setIsRunning(false);
            setCurrentStep(0);
            toast({
              title: "Processus terminé !",
              description: "Toutes les étapes ont été complétées avec succès.",
            });
          }
        } catch (error) {
          setIsRunning(false);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors du traitement.",
            variant: "destructive",
          });
        }
      }
    };
    
    processStep();
  };

  const stopDemo = () => {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-6 w-6" />
          Démonstration automatique du processus
        </CardTitle>
        <CardDescription>
          Regardez votre demande progresser automatiquement à travers toutes les étapes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={startDemo} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Lancer la démo
          </Button>
          <Button 
            variant="outline" 
            onClick={stopDemo} 
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