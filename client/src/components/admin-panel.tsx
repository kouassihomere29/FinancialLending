import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  Settings,
  ChevronRight,
  Clock
} from "lucide-react";

const steps = [
  { id: 1, title: "Simulez votre prêt", icon: Calculator },
  { id: 2, title: "Soumettez votre projet", icon: FileText },
  { id: 3, title: "Analyse & validation du dossier", icon: Search },
  { id: 4, title: "Soumission au prêteur", icon: Send },
  { id: 5, title: "Réponse du prêteur", icon: MessageSquare },
  { id: 6, title: "Ouverture de compte", icon: UserCheck },
  { id: 7, title: "Virement des fonds", icon: DollarSign },
];

const lenders = [
  { id: "BANK001", name: "Crédit Mutuel" },
  { id: "BANK002", name: "BNP Paribas" },
  { id: "BANK003", name: "Société Générale" },
  { id: "BANK004", name: "LCL" },
  { id: "BANK005", name: "Crédit Agricole" },
];

export default function AdminPanel() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [lenderForm, setLenderForm] = useState({ lenderId: "", lenderName: "" });
  const [responseForm, setResponseForm] = useState({ response: "", message: "" });
  const [accountForm, setAccountForm] = useState({ accountNumber: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/loan-applications"],
  });

  const advanceStepMutation = useMutation({
    mutationFn: async ({ id, step }: { id: number; step: number }) => {
      return await apiRequest(`/api/loan-applications/${id}/advance`, {
        method: "PATCH",
        body: JSON.stringify({ step }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/loan-applications"] });
      toast({ title: "Étape avancée avec succès" });
    },
  });

  const assignLenderMutation = useMutation({
    mutationFn: async ({ id, lenderId, lenderName }: { id: number; lenderId: string; lenderName: string }) => {
      return await apiRequest(`/api/loan-applications/${id}/assign-lender`, {
        method: "PATCH",
        body: JSON.stringify({ lenderId, lenderName }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setLenderForm({ lenderId: "", lenderName: "" });
      toast({ title: "Prêteur assigné avec succès" });
    },
  });

  const lenderResponseMutation = useMutation({
    mutationFn: async ({ id, response, message }: { id: number; response: string; message?: string }) => {
      return await apiRequest(`/api/loan-applications/${id}/lender-response`, {
        method: "PATCH",
        body: JSON.stringify({ response, message }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setResponseForm({ response: "", message: "" });
      toast({ title: "Réponse du prêteur enregistrée" });
    },
  });

  const setAccountMutation = useMutation({
    mutationFn: async ({ id, accountNumber }: { id: number; accountNumber: string }) => {
      return await apiRequest(`/api/loan-applications/${id}/account`, {
        method: "PATCH",
        body: JSON.stringify({ accountNumber }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setAccountForm({ accountNumber: "" });
      toast({ title: "Numéro de compte enregistré" });
    },
  });

  const getStatusBadge = (app: any) => {
    if (app.status === "completed") {
      return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    }
    if (app.status === "rejected") {
      return <Badge variant="destructive">Rejeté</Badge>;
    }
    if (app.lenderResponse === "approved") {
      return <Badge className="bg-blue-100 text-blue-800">Approuvé</Badge>;
    }
    return <Badge variant="secondary">Étape {app.currentStep}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Panel d'administration</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de prêt</CardTitle>
            <CardDescription>
              {applications?.length || 0} demande(s) en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {applications?.map((app: any) => (
                <div
                  key={app.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedApp?.id === app.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">#{app.id} - {app.firstName} {app.lastName}</h3>
                      <p className="text-sm text-gray-600">{app.amount}€ sur {app.duration} mois</p>
                    </div>
                    {getStatusBadge(app)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {format(new Date(app.createdAt), "d MMM yyyy", { locale: fr })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Details & Actions */}
        {selectedApp && (
          <div className="space-y-6">
            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle>Demande #{selectedApp.id}</CardTitle>
                <CardDescription>
                  {selectedApp.firstName} {selectedApp.lastName} • {selectedApp.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Montant:</span>
                    <span className="ml-2 font-semibold">{selectedApp.amount}€</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Durée:</span>
                    <span className="ml-2 font-semibold">{selectedApp.duration} mois</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Étape actuelle:</span>
                    <span className="ml-2 font-semibold">{selectedApp.currentStep}/7</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prêteur:</span>
                    <span className="ml-2 font-semibold">{selectedApp.lenderName || "Non assigné"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Management */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step) => {
                    const isCompleted = selectedApp.currentStep > step.id;
                    const isCurrent = selectedApp.currentStep === step.id;
                    const IconComponent = step.icon;

                    return (
                      <div key={step.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-green-100 text-green-600" :
                            isCurrent ? "bg-blue-100 text-blue-600" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className={`text-sm ${isCompleted ? "text-green-900" : isCurrent ? "text-blue-900" : "text-gray-500"}`}>
                            {step.title}
                          </span>
                        </div>
                        {!isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => advanceStepMutation.mutate({ id: selectedApp.id, step: step.id })}
                            disabled={advanceStepMutation.isPending}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Lender Assignment */}
            {selectedApp.currentStep >= 4 && !selectedApp.lenderName && (
              <Card>
                <CardHeader>
                  <CardTitle>Assigner un prêteur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Prêteur</Label>
                    <Select 
                      value={lenderForm.lenderId} 
                      onValueChange={(value) => {
                        const lender = lenders.find(l => l.id === value);
                        setLenderForm({ lenderId: value, lenderName: lender?.name || "" });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un prêteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {lenders.map((lender) => (
                          <SelectItem key={lender.id} value={lender.id}>
                            {lender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => assignLenderMutation.mutate({ 
                      id: selectedApp.id, 
                      lenderId: lenderForm.lenderId, 
                      lenderName: lenderForm.lenderName 
                    })}
                    disabled={!lenderForm.lenderId || assignLenderMutation.isPending}
                  >
                    Assigner le prêteur
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Lender Response */}
            {selectedApp.currentStep >= 5 && selectedApp.lenderName && !selectedApp.lenderResponse && (
              <Card>
                <CardHeader>
                  <CardTitle>Réponse du prêteur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Décision</Label>
                    <Select value={responseForm.response} onValueChange={(value) => setResponseForm({ ...responseForm, response: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Message (optionnel)</Label>
                    <Textarea 
                      value={responseForm.message} 
                      onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                      placeholder="Message du prêteur..."
                    />
                  </div>
                  <Button 
                    onClick={() => lenderResponseMutation.mutate({ 
                      id: selectedApp.id, 
                      response: responseForm.response, 
                      message: responseForm.message 
                    })}
                    disabled={!responseForm.response || lenderResponseMutation.isPending}
                  >
                    Enregistrer la réponse
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Account Number */}
            {selectedApp.currentStep >= 6 && selectedApp.lenderResponse === "approved" && !selectedApp.accountNumber && (
              <Card>
                <CardHeader>
                  <CardTitle>Numéro de compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Numéro de compte</Label>
                    <Input 
                      value={accountForm.accountNumber} 
                      onChange={(e) => setAccountForm({ accountNumber: e.target.value })}
                      placeholder="FR76 1234 5678 9012 3456 7890 123"
                    />
                  </div>
                  <Button 
                    onClick={() => setAccountMutation.mutate({ 
                      id: selectedApp.id, 
                      accountNumber: accountForm.accountNumber 
                    })}
                    disabled={!accountForm.accountNumber || setAccountMutation.isPending}
                  >
                    Enregistrer le compte
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}