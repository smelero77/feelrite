"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BasicInfoSection } from "./form-sections/basic-info-section"
import { MultipleContactsSection } from "./form-sections/multiple-contacts-section"
import { AddressSection } from "./form-sections/address-section"
import { IdentitySection } from "./form-sections/identity-section"
import { BillingSection } from "./form-sections/billing-section"
import { Save, X, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { patientSchema, PatientFormData } from "@/lib/validators/patient-validator"
import { cn } from "@/lib/utils"

export function DesktopPatientForm() {
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      notes: "",
      isMinor: false,
      contacts: [
        {
          id: "1",
          name: "",
          relationship: "",
          phone: "",
          email: "",
          whatsapp: "",
          isPrimary: true,
          isEmergency: false
        }
      ],
      street: "",
      number: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      documentType: "",
      documentNumber: "",
      issueDate: "",
      expiryDate: "",
      billingEnabled: false,
      billingName: "",
      billingEmail: "",
      billingDocumentType: "",
      billingDocumentNumber: "",
      billingStreet: "",
      billingNumber: "",
      billingCity: "",
      billingPostalCode: ""
    }
  })

  const steps = [
    { id: 1, title: "Información Básica" },
    { id: 2, title: "Contactos" },
    { id: 3, title: "Dirección" },
    { id: 4, title: "Identidad" },
    { id: 5, title: "Facturación" }
  ]

  const handleNext = async () => {
    let fieldsToValidate: (keyof PatientFormData)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "birthDate", "gender", "notes", "isMinor"]
        break
      case 2:
        fieldsToValidate = ["contacts"]
        break
      case 3:
        fieldsToValidate = ["street", "number", "city", "state", "postalCode", "country"]
        break
      case 4:
        fieldsToValidate = ["documentType", "documentNumber", "issueDate", "expiryDate"]
        break
      case 5:
        fieldsToValidate = ["billingEnabled", "billingName", "billingEmail", "billingDocumentType", "billingDocumentNumber", "billingStreet", "billingNumber", "billingCity", "billingPostalCode"]
        break
    }
    
    const isValid = await form.trigger(fieldsToValidate)
    
    if (isValid) {
      // Marcar el paso como completado
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step])
      }
      
      if (step < steps.length) {
        setStep(step + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      // Al retroceder, mantener los pasos completados hasta el paso anterior
      const newStep = step - 1
      setStep(newStep)
      
      // Ajustar completedSteps para que solo incluya los pasos hasta el paso actual
      const updatedCompletedSteps = completedSteps.filter(completedStep => completedStep < newStep)
      setCompletedSteps(updatedCompletedSteps)
    }
  }

  const onSubmit = (data: PatientFormData) => {
    console.log("Datos del formulario:", data)
    // Aquí iría la lógica para guardar el paciente
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 2:
        return (
          <MultipleContactsSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 3:
        return (
          <AddressSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 4:
        return (
          <IdentitySection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 5:
        return (
          <BillingSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crear Paciente</h1>
          <p className="text-muted-foreground">
            Añadir un nuevo paciente al sistema
          </p>
        </div>
      </div>

      {/* Barra Separadora */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
      </div>

      <div className="flex gap-8">
                 {/* Vertical Stepper */}
         <div className="w-80 flex-shrink-0">
           <div className="pt-8">
             <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
              
                                            {/* Progress Bar Fill */}
                <div 
                  className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary transition-all duration-700 ease-out"
                  style={{ 
                    height: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
                    transformOrigin: 'top'
                  }}
                />
              
              {steps.map((stepItem, index) => {
                const isCompleted = completedSteps.includes(stepItem.id)
                const isCurrent = step === stepItem.id
                const isFuture = stepItem.id > step

                return (
                  <div key={stepItem.id} className="relative flex items-start mb-8 last:mb-0">
                                         {/* Step Circle */}
                     <div className="flex items-center justify-center w-10 h-10 z-10">
                       {isCompleted ? (
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-all duration-500 ease-out transform scale-110">
                           <Check className="h-4 w-4 text-primary-foreground transition-all duration-300" />
                         </div>
                       ) : (
                         <div className={cn(
                           "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ease-out",
                           isCurrent && "bg-primary text-primary-foreground transform scale-110",
                           isFuture && "bg-muted text-muted-foreground"
                         )}>
                           {stepItem.id}
                         </div>
                       )}
                     </div>

                                         {/* Step Content */}
                     <div className="ml-4 flex-1">
                       <h3 className={cn(
                         "text-sm font-medium transition-all duration-500 ease-out",
                         isCompleted && "text-primary",
                         isCurrent && "text-primary",
                         isFuture && "text-muted-foreground"
                       )}>
                         {stepItem.title}
                       </h3>
                       {isCurrent && (
                         <p className="text-xs text-muted-foreground mt-1 transition-all duration-300 ease-out">
                           Paso actual
                         </p>
                       )}
                       {isCompleted && (
                         <p className="text-xs text-primary mt-1 transition-all duration-300 ease-out">
                           Completado
                         </p>
                       )}
                     </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

                 {/* Step Content */}
         <div className="flex-1">
           <div className="pt-8 space-y-4">
             {renderStepContent()}
           </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {step < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Finalizar y Guardar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 