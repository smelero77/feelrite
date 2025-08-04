"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { BasicInfoSection } from "./form-sections/basic-info-section"
import { MultipleContactsSection } from "./form-sections/multiple-contacts-section"
import { AddressSection } from "./form-sections/address-section"
import { IdentitySection } from "./form-sections/identity-section"
import { BillingSection } from "./form-sections/billing-section"
import { MobileNav } from "./mobile-nav"
import { Save, X, ArrowLeft, ArrowRight } from "lucide-react"
import { patientSchema } from "@/lib/validators/patient-validator"

type FormData = {
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  notes: string
  isMinor: boolean
  contacts: Array<{
    id: string
    name: string
    relationship: string
    phone: string
    email: string
    whatsapp: string
    isPrimary: boolean
    isEmergency: boolean
  }>
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  country: string
  documentType: string
  documentNumber: string
  issueDate: string
  expiryDate: string
  billingEnabled: boolean
  billingName: string
  billingEmail: string
  billingDocumentType: string
  billingDocumentNumber: string
  billingStreet: string
  billingNumber: string
  billingCity: string
  billingPostalCode: string
}

export function MobilePatientForm() {
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const form = useForm<FormData>({
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
    { id: 1, title: "Información Básica", description: "Datos personales del paciente" },
    { id: 2, title: "Contactos", description: "Información de contacto y emergencia" },
    { id: 3, title: "Dirección", description: "Dirección de residencia" },
    { id: 4, title: "Identidad", description: "Documentos de identificación" },
    { id: 5, title: "Facturación", description: "Información de facturación (opcional)" }
  ]

  const handleNext = async () => {
    let fieldsToValidate: string[] = []
    
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
    
    const isValid = await form.trigger(fieldsToValidate as any)
    
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
      setStep(step - 1)
    }
  }

  const onSubmit = (data: FormData) => {
    console.log("Datos del formulario:", data)
    // Aquí iría la lógica para guardar el paciente
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <BasicInfoSection 
              register={form.register}
              control={form.control}
              errors={form.formState.errors}
              watch={form.watch}
              setValue={form.setValue}
            />
            <BillingSection 
              register={form.register}
              control={form.control}
              errors={form.formState.errors}
              watch={form.watch}
              setValue={form.setValue}
            />
          </div>
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

  const currentStep = steps.find(s => s.id === step)
  const progressText = `Paso ${step} de ${steps.length}`

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation with Dynamic Title */}
      <MobileNav 
        title={`Crear Paciente (${progressText})`}
        onSave={form.handleSubmit(onSubmit)}
      />
      
      {/* Main Content - One Screen per Step */}
      <div className="p-4 pb-24">
        {/* Step Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{currentStep?.title}</h2>
            <span className="text-sm text-muted-foreground">{progressText}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStep?.description}
          </p>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {renderStepContent()}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-safe">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex-1 mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {step < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 ml-2"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="flex-1 ml-2"
            >
              <Save className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 