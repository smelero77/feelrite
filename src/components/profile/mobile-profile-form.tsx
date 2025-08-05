"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IdentificationSection } from "./form-sections/identification-section"
import { BillingSection } from "./form-sections/billing-section"
import { BrandingSection } from "./form-sections/branding-section"
import { Save, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { profileSchema, ProfileFormData } from "@/lib/validators/profile-validator"
import { cn } from "@/lib/utils"

export function MobileProfileForm() {
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
      const newStep = step - 1
      setStep(newStep)
      const updatedCompletedSteps = completedSteps.filter(completedStep => completedStep < newStep)
      setCompletedSteps(updatedCompletedSteps)
    }
  }

  const onSubmit = (data: ProfileFormData) => {
    console.log("Datos del perfil:", data)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Mi Ficha Profesional</h1>
        <p className="text-muted-foreground">
          Gestiona tu información profesional
        </p>
      </div>

      {/* Mobile Stepper */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepItem, index) => {
              const isCompleted = completedSteps.includes(stepItem.id)
              const isCurrent = step === stepItem.id
              const isFuture = stepItem.id > step

              return (
                <div key={stepItem.id} className="flex flex-col items-center">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        isCurrent && "bg-primary text-primary-foreground",
                        isFuture && "bg-muted text-muted-foreground"
                      )}>
                        {stepItem.id}
                      </div>
                    )}
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-2",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 text-center",
                    isCompleted && "text-primary",
                    isCurrent && "text-primary",
                    isFuture && "text-muted-foreground"
                  )}>
                    {stepItem.title}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-4">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {step < steps.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        )}
      </div>
    </div>
  )
} 