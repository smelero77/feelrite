"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { IdentificationSection } from "./form-sections/identification-section"
import { BillingSection } from "./form-sections/billing-section"
import { BrandingSection } from "./form-sections/branding-section"
import { Save, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { profileSchema, ProfileFormData } from "@/lib/validators/profile-validator"
import { cn } from "@/lib/utils"

export function DesktopProfileForm() {
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      nif: "",
      professionalLicense: "",
      email: "",
      phone: "",
      fullAddress: "",
      postalCode: "",
      city: "",
      province: "",
      country: "España",
      iban: "",
      logoUrl: "",
      signatureImageUrl: "",
    }
  })

  const steps = [
    { id: 1, title: "Identificación" },
    { id: 2, title: "Facturación" },
    { id: 3, title: "Personalización" }
  ]

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ["fullName", "nif", "professionalLicense", "email", "phone"]
        break
      case 2:
        fieldsToValidate = ["fullAddress", "postalCode", "city", "province", "country", "iban"]
        break
      case 3:
        fieldsToValidate = ["logoUrl", "signatureImageUrl"]
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

  const onSubmit = (data: ProfileFormData) => {
    console.log("Datos del perfil:", data)
    // Aquí iría la lógica para guardar el perfil
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <IdentificationSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 2:
        return (
          <BillingSection 
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
          />
        )
      case 3:
        return (
          <BrandingSection 
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
          <h1 className="text-3xl font-bold tracking-tight">Mi Ficha Profesional</h1>
          <p className="text-muted-foreground">
            Gestiona tu información profesional para automatizar facturas, consentimientos y documentos
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