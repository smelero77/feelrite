import { z } from "zod"

// Esquema para un contacto individual
const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del contacto es obligatorio"),
  relationship: z.string().min(1, "La relación es obligatoria"),
  phone: z.string().regex(/^(?:\+34|0034|34)?[6789]\d{8}$/, "El formato del teléfono no es válido"),
  email: z.string().email("El formato del email no es válido"),
  whatsapp: z.string().optional(),
  isPrimary: z.boolean(),
  isEmergency: z.boolean()
})

// Esquema principal del paciente
export const patientSchema = z.object({
  // Información básica
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "Los apellidos son obligatorios"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  gender: z.string().optional(),
  notes: z.string().optional(),
  isMinor: z.boolean().default(false),

  // Contactos
  contacts: z.array(contactSchema).min(1, "Debe haber al menos un contacto"),

  // Dirección
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),

  // Identidad
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),

  // Facturación
  billingEnabled: z.boolean().default(false),
  billingName: z.string().optional(),
  billingEmail: z.string().email("El formato del email de facturación no es válido").optional(),
  billingDocumentType: z.string().optional(),
  billingDocumentNumber: z.string().optional(),
  billingStreet: z.string().optional(),
  billingNumber: z.string().optional(),
  billingCity: z.string().optional(),
  billingPostalCode: z.string().optional()
}).superRefine((data, ctx) => {
  // Validación 1: Debe haber exactamente un contacto principal
  const primaryContacts = data.contacts.filter(contact => contact.isPrimary)
  if (primaryContacts.length !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debe haber exactamente un contacto marcado como principal",
      path: ["contacts"]
    })
  }

  // Validación 2: Para menores de 14 años, debe haber un tutor
  if (data.birthDate) {
    const birthDate = new Date(data.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 14) {
      const hasTutor = data.contacts.some(contact => 
        (contact.relationship === "parent" || contact.relationship === "guardian") &&
        contact.name.trim() !== "" &&
        (contact.email.trim() !== "" || contact.phone.trim() !== "")
      )

      if (!hasTutor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Para menores de 14 años, es obligatorio incluir información de un padre/madre o tutor legal con nombre y contacto válido",
          path: ["contacts"]
        })
      }
    }
  }

  // Validación 3: Si la facturación está habilitada, los campos son obligatorios
  if (data.billingEnabled) {
    if (!data.billingName || data.billingName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nombre de facturación es obligatorio cuando la facturación está habilitada",
        path: ["billingName"]
      })
    }

    if (!data.billingDocumentNumber || data.billingDocumentNumber.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El número de documento de facturación es obligatorio cuando la facturación está habilitada",
        path: ["billingDocumentNumber"]
      })
    }

    if (!data.billingStreet || data.billingStreet.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La dirección de facturación es obligatoria cuando la facturación está habilitada",
        path: ["billingStreet"]
      })
    }

    if (!data.billingCity || data.billingCity.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La ciudad de facturación es obligatoria cuando la facturación está habilitada",
        path: ["billingCity"]
      })
    }

    if (!data.billingPostalCode || data.billingPostalCode.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El código postal de facturación es obligatorio cuando la facturación está habilitada",
        path: ["billingPostalCode"]
      })
    }
  }
})

export type PatientFormData = z.infer<typeof patientSchema> 