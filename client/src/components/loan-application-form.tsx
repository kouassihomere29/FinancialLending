import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { insertLoanApplicationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateLoan } from "@/lib/loan-calculator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = {
  amount: number;
  duration: number;
  purpose: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employmentStatus: string;
  monthlyIncome: string;
  monthlyExpenses?: number;
  termsAccepted: boolean;
  creditCheckAccepted: boolean;
  marketingAccepted?: boolean;
  monthlyPayment?: string;
  totalCost?: string;
};

export default function LoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertLoanApplicationSchema.extend({
      monthlyPayment: insertLoanApplicationSchema.shape.monthlyPayment.optional(),
      totalCost: insertLoanApplicationSchema.shape.totalCost.optional(),
    })),
    defaultValues: {
      amount: 1500,
      duration: 6,
      purpose: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employmentStatus: "",
      monthlyIncome: "",
      monthlyExpenses: 0,
      termsAccepted: false,
      creditCheckAccepted: false,
      marketingAccepted: false,
    },
  });

  const amount = form.watch("amount");
  const duration = form.watch("duration");
  const calculation = calculateLoan(amount, duration);

  const submitApplication = useMutation({
    mutationFn: async (data: FormData) => {
      const applicationData = {
        ...data,
        monthlyPayment: calculation.monthlyPayment.toString(),
        totalCost: calculation.totalCost.toString(),
      };
      return apiRequest("POST", "/api/loan-applications", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Demande soumise avec succès !",
        description: "Vous recevrez une réponse dans les 5 minutes par email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      form.reset();
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitApplication.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepClass = (step: number) => {
    return step <= currentStep
      ? "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold"
      : "w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold";
  };

  const getStepTextClass = (step: number) => {
    return step <= currentStep
      ? "ml-2 text-sm font-medium text-primary"
      : "ml-2 text-sm font-medium text-gray-600";
  };

  return (
    <section id="application" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Votre demande de prêt
          </h2>
          <p className="text-xl text-gray-600">Complétez votre demande en 3 minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className={getStepClass(1)}>1</div>
              <span className={getStepTextClass(1)}>Montant</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={getStepClass(2)}>2</div>
              <span className={getStepTextClass(2)}>Informations</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={getStepClass(3)}>3</div>
              <span className={getStepTextClass(3)}>Validation</span>
            </div>
          </div>
        </div>

        <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Loan Amount */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-6">Définissez votre prêt</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant souhaité</FormLabel>
                            <FormControl>
                              <div>
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={3000}
                                  min={500}
                                  step={50}
                                  className="w-full mb-2"
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                  <span>500€</span>
                                  <span className="font-bold text-primary text-xl">{field.value}€</span>
                                  <span>3000€</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durée de remboursement</FormLabel>
                            <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez la durée" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 mois</SelectItem>
                                <SelectItem value="6">6 mois</SelectItem>
                                <SelectItem value="9">9 mois</SelectItem>
                                <SelectItem value="12">12 mois</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motif du prêt</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un motif" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="urgence">Urgence financière</SelectItem>
                              <SelectItem value="travaux">Travaux</SelectItem>
                              <SelectItem value="voyage">Voyage</SelectItem>
                              <SelectItem value="equipement">Équipement</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Loan Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-primary">
                      <h4 className="font-semibold text-gray-900 mb-4">Récapitulatif de votre prêt</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Montant emprunté</span>
                          <div className="font-semibold text-lg">{amount}€</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Mensualité</span>
                          <div className="font-semibold text-lg text-primary">{calculation.monthlyPayment}€</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Durée</span>
                          <div className="font-semibold">{duration} mois</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Coût total</span>
                          <div className="font-semibold">{calculation.totalCost}€</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={nextStep} className="bg-primary text-white hover:bg-primary-dark">
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-6">Vos informations personnelles</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situation professionnelle *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre situation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cdi">CDI</SelectItem>
                              <SelectItem value="cdd">CDD</SelectItem>
                              <SelectItem value="interim">Intérim</SelectItem>
                              <SelectItem value="freelance">Freelance</SelectItem>
                              <SelectItem value="retraite">Retraité</SelectItem>
                              <SelectItem value="etudiant">Étudiant</SelectItem>
                              <SelectItem value="chomage">Demandeur d'emploi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="monthlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenus mensuels nets *</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez vos revenus" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1000-1500">1 000€ - 1 500€</SelectItem>
                                <SelectItem value="1500-2000">1 500€ - 2 000€</SelectItem>
                                <SelectItem value="2000-3000">2 000€ - 3 000€</SelectItem>
                                <SelectItem value="3000+">Plus de 3 000€</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="monthlyExpenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Charges mensuelles</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="800" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={prevStep} variant="outline" className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                      <Button onClick={nextStep} className="bg-primary text-white hover:bg-primary-dark">
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Validation */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-6">Validation de votre demande</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-4">Récapitulatif de votre demande</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                          <span className="font-medium">Montant :</span> {amount}€
                        </div>
                        <div>
                          <span className="font-medium">Durée :</span> {duration} mois
                        </div>
                        <div>
                          <span className="font-medium">Mensualité :</span> {calculation.monthlyPayment}€
                        </div>
                        <div>
                          <span className="font-medium">Coût total :</span> {calculation.totalCost}€
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-700">
                                J'accepte les conditions générales et la politique de confidentialité
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="creditCheckAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-700">
                                J'accepte que mes informations soient consultées auprès des organismes de crédit
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="marketingAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-700">
                                J'accepte de recevoir des offres commerciales par email (optionnel)
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Information importante</p>
                        <p>Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-between">
                      <Button onClick={prevStep} variant="outline" className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitApplication.isPending}
                        className="bg-success text-white hover:bg-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {submitApplication.isPending ? "Finalisation..." : "Finaliser ma demande"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
