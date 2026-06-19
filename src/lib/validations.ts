import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  role: z.enum(['OWNER', 'MANAGER']),
})

export const propertySchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'COMMERCIAL']),
  rentAmount: z.number().positive('Le montant doit être positif'),
})

export const tenantSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  idType: z.enum(['CNI', 'PASSPORT', 'RESIDENCE_PERMIT', 'VOTER_CARD']).optional(),
  idNumber: z.string().optional(),
})

export const ownerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
})

export const contractSchema = z.object({
  tenantId: z.string().min(1, 'Locataire requis'),
  propertyId: z.string().min(1, 'Bien requis'),
  startDate: z.string().min(1, 'Date de début requise'),
  endDate: z.string().optional(),
  rentAmount: z.number().positive('Le loyer doit être positif'),
  deposit: z.number().optional(),
})

export const paymentSchema = z.object({
  tenantId: z.string().min(1, 'Locataire requis'),
  contractId: z.string().min(1, 'Contrat requis'),
  amount: z.number().positive('Le montant doit être positif'),
  expectedAmount: z.number().positive('Le montant attendu doit être positif'),
  method: z.enum(['MOBILE_MONEY', 'CASH', 'BANK_TRANSFER']),
  dueDate: z.string().min(1, 'Date d\'échéance requise'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type TenantInput = z.infer<typeof tenantSchema>
export type OwnerInput = z.infer<typeof ownerSchema>
export type ContractInput = z.infer<typeof contractSchema>
export type PaymentInput = z.infer<typeof paymentSchema>