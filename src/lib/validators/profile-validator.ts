import { z } from "zod"

export const profileSchema = z.object({
  // Identificación
  fullName: z.string().min(1, "El nombre completo es requerido"),
  nif: z.string().min(1, "El NIF/CIF es requerido"),
  professionalLicense: z.string().min(1, "El número de colegiación es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),

  // Facturación
  fullAddress: z.string().min(1, "La dirección fiscal es requerida"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  city: z.string().min(1, "La ciudad es requerida"),
  province: z.string().min(1, "La provincia es requerida"),
  country: z.string().min(1, "El país es requerido"),
  iban: z.string().optional(),

  // Personalización
  logoUrl: z.string().optional(),
  signatureImageUrl: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema> 