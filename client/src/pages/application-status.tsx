import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileText, Search, Send, MessageSquare, UserCheck, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const steps = [
  {
    id: 1,
    title: "Simulez votre prêt",
    description: "Simulation de votre prêt personnel",
    icon: Calculator,
  },
  {
    id: 2,
    title: "Soumettez votre projet",
    description: "Dossier de demande complet soumis",
    icon: FileText,
  },
  {
    id: 3,
    title: "Analyse & validation du dossier",
    description: "Vérification et validation de votre dossier",
    icon: Search,
  },
  {
    id: 4,
    title: "Soumission au prêteur",
    description: "Transmission à notre réseau de prêteurs",
    icon: Send,
  },
  {
    id: 5,
    title: "Réponse du prêteur",
    description: "Décision et proposition de plan de remboursement",
    icon: MessageSquare,
  },
  {
    id: 6,
    title: "Ouverture de compte",
    description: "Création de votre compte chez le prêteur",
    icon: UserCheck,
  },
  {
    id: 7,
    title: "Virement des fonds",
    description: "Réception des fonds sur votre compte",
    icon: DollarSign,
  },
];

export default function ApplicationStatus() {
  const [match, params] = useRoute("/application/:id");
  const applicationId = params?.id;

  const { data: application, isLoading } = useQuery({
    queryKey: ["/api/loan-applications", applicationId],
    enabled: !!applicationId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre demande...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Demande introuvable</h1>
            <p className="text-gray-600 mb-6">La demande que vous recherchez n'existe pas ou a été supprimée.</p>
            <Link href="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = application.currentStep || 1;
  const progressPercentage = ((currentStep - 1) / 6) * 100;

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const getStatusBadge = () => {
    if (application.status === "completed") {
      return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    }
    if (application.status === "rejected") {
      return <Badge variant="destructive">Rejeté</Badge>;
    }
    if (application.lenderResponse === "approved") {
      return <Badge className="bg-blue-100 text-blue-800">Approuvé</Badge>;
    }
    return <Badge variant="secondary">En cours</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi de votre demande
          </h1>
          <p className="text-gray-600">
            Demande #{application.id} • {getStatusBadge()}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Progression de votre demande
            </CardTitle>
            <CardDescription>
              Étape {currentStep} sur 7 • {progressPercentage.toFixed(0)}% terminé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="text-sm text-gray-600">
              Créé le {format(new Date(application.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Détails du prêt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="font-semibold">{application.amount}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-semibold">{application.duration} mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mensualité</span>
                <span className="font-semibold">{application.monthlyPayment}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coût total</span>
                <span className="font-semibold">{application.totalCost}€</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom</span>
                <span className="font-semibold">{application.firstName} {application.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-semibold">{application.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone</span>
                <span className="font-semibold">{application.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenu mensuel</span>
                <span className="font-semibold">{application.monthlyIncome}€</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lender Information */}
        {application.lenderName && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations du prêteur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Prêteur assigné</span>
                <span className="font-semibold">{application.lenderName}</span>
              </div>
              {application.lenderResponse && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Réponse</span>
                  <Badge className={application.lenderResponse === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {application.lenderResponse === "approved" ? "Approuvé" : "Rejeté"}
                  </Badge>
                </div>
              )}
              {application.lenderMessage && (
                <div>
                  <span className="text-gray-600 block mb-1">Message du prêteur</span>
                  <p className="text-sm bg-gray-50 p-3 rounded">{application.lenderMessage}</p>
                </div>
              )}
              {application.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de compte</span>
                  <span className="font-mono font-semibold">{application.accountNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Steps Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Étapes du processus</CardTitle>
            <CardDescription>
              Suivez l'avancement de votre demande étape par étape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const IconComponent = step.icon;
                const isCompleted = status === "completed";
                const isCurrent = status === "current";

                return (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-100 text-green-600" :
                      isCurrent ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-medium ${
                        isCompleted ? "text-green-900" :
                        isCurrent ? "text-blue-900" :
                        "text-gray-500"
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
                      {getStepCompletedDate(application, step.id) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Terminé le {format(new Date(getStepCompletedDate(application, step.id)!), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function getStepCompletedDate(application: any, stepId: number): string | null {
  const fieldMap = {
    1: 'step1CompletedAt',
    2: 'step2CompletedAt', 
    3: 'step3CompletedAt',
    4: 'step4CompletedAt',
    5: 'step5CompletedAt',
    6: 'step6CompletedAt',
    7: 'step7CompletedAt',
  };
  
  const field = fieldMap[stepId as keyof typeof fieldMap];
  return application[field] || null;
}