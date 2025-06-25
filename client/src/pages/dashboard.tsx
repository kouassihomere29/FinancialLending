import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calculator, 
  FileText, 
  Search, 
  Send, 
  MessageSquare, 
  UserCheck, 
  DollarSign,
  LogOut,
  User
} from "lucide-react";

const steps = [
  { id: 1, title: "Simulation", description: "Calcul et simulation de votre prêt", icon: Calculator },
  { id: 2, title: "Dossier", description: "Constitution de votre dossier complet", icon: FileText },
  { id: 3, title: "Validation", description: "Validation et soumission du dossier", icon: Search },
  { id: 4, title: "Analyse", description: "Analyse par nos équipes", icon: Send },
  { id: 5, title: "Prêteur", description: "Transmission à nos partenaires financiers", icon: MessageSquare },
  { id: 6, title: "Compte", description: "Ouverture de compte chez le prêteur", icon: UserCheck },
  { id: 7, title: "Fonds", description: "Virement des fonds sur votre compte", icon: DollarSign }
];

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/loan-applications"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès restreint</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à votre espace client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = "/auth"}
              className="w-full"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStepStatus = (stepId: number, application: any) => {
    if (application.currentStep > stepId) return "completed";
    if (application.currentStep === stepId) return "current";
    return "pending";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "step1":
      case "step2":
      case "step3":
        return <Badge variant="secondary">En cours - Étape {status.replace('step', '')}</Badge>;
      case "step4":
      case "step5":
      case "step6":
      case "step7":
        return <Badge variant="default">Traitement - Étape {status.replace('step', '')}</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-600">Terminé</Badge>;
      case "rejected":
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Mon Espace Client</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/logout', {
                      method: 'POST',
                      credentials: 'include'
                    });
                    if (response.ok) {
                      window.location.href = '/';
                    }
                  } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/';
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.firstName} !
          </h2>
          <p className="text-gray-600">
            Suivez l'avancement de vos demandes de prêt et gérez votre compte.
          </p>
        </div>

        {/* Applications Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Mes demandes de prêt</h3>
          
          {applicationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos demandes...</p>
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucune demande</h4>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore de demande de prêt en cours.
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Faire une nouvelle demande
                </Button>
              </CardContent>
            </Card>
          ) : (
            applications.map((application: any) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Demande #{application.id}</CardTitle>
                      <CardDescription>
                        Montant: {application.amount}€ • Durée: {application.duration} mois
                        <br />
                        Créée le {format(new Date(application.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Steps */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Progression (Étape {application.currentStep}/7)</h4>
                    <div className="flex items-center justify-between space-x-2">
                      {steps.map((step, index) => {
                        const status = getStepStatus(step.id, application);
                        const IconComponent = step.icon;
                        const isCompleted = status === "completed";
                        const isCurrent = status === "current";
                        
                        return (
                          <div key={step.id} className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                              isCompleted ? "bg-green-100 text-green-600" :
                              isCurrent ? "bg-blue-100 text-blue-600" :
                              "bg-gray-100 text-gray-400"
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <div className={`text-xs font-medium ${
                                isCompleted ? "text-green-900" :
                                isCurrent ? "text-blue-900" :
                                "text-gray-500"
                              }`}>
                                {step.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Mensualité:</span> {application.monthlyPayment}€
                    </div>
                    <div>
                      <span className="font-medium">Coût total:</span> {application.totalCost}€
                    </div>
                    <div>
                      <span className="font-medium">Motif:</span> {application.purpose}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {application.email}
                    </div>
                  </div>

                  {/* Lender Information */}
                  {application.lenderName && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Information prêteur</h5>
                      <div className="text-sm text-blue-800">
                        <div><span className="font-medium">Prêteur:</span> {application.lenderName}</div>
                        {application.lenderResponse && (
                          <div><span className="font-medium">Statut:</span> {application.lenderResponse}</div>
                        )}
                        {application.lenderMessage && (
                          <div><span className="font-medium">Message:</span> {application.lenderMessage}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}