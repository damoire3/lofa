export const REMINDER_SCHEDULE = {
  BEFORE: [-7, -3, 0],
  AFTER: [1, 3, 7],
} as const

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'En attente',
  PARTIAL: 'Partiel',
  PAID: 'Payé',
  LATE: 'En retard',
} as const

export const CONTRACT_STATUS_LABELS = {
  ACTIVE: 'Actif',
  EXPIRED: 'Expiré',
  TERMINATED: 'Résilié',
} as const

export const PROPERTY_TYPE_LABELS = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  STUDIO: 'Studio',
  COMMERCIAL: 'Local commercial',
} as const

export const ROLE_LABELS = {
  OWNER: 'Propriétaire',
  MANAGER: 'Gestionnaire',
} as const

export const CURRENCY = 'XOF'
export const APP_NAME = 'Lofa'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'