export const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      properties: 5,
      tenants: 5,
    },
    commission: 0.05,
    features: {
      reminders: true,
      tenantPortal: true,
      documents: true,
      reports: false,
      ownerPortal: false,
      bankTransfer: false,
      prioritySupport: false,
    },
  },

  PRO: {
    name: 'Pro',
    price: {
      monthly: 7900,
      yearly: 79000,
    },
    limits: {
      properties: 15,
      tenants: 15,
    },
    commission: 0,
    features: {
      reminders: true,
      tenantPortal: true,
      documents: true,
      reports: true,
      ownerPortal: false,
      bankTransfer: false,
      prioritySupport: true,
    },
  },

  AGENCY: {
    name: 'Agence',
    price: {
      monthly: 19900,
      yearly: 199000,
    },
    limits: {
      properties: Infinity,
      tenants: Infinity,
    },
    commission: 0,
    features: {
      reminders: true,
      tenantPortal: true,
      documents: true,
      reports: true,
      ownerPortal: true,
      bankTransfer: true,
      prioritySupport: true,
    },
  },
} as const

export const FEATURE_LABELS = {
  reminders: 'Rappels automatiques',
  tenantPortal: 'Portail locataire',
  documents: 'Documents & quittances',
  reports: 'Rapports PDF',
  ownerPortal: 'Lien suivi propriétaire',
  bankTransfer: 'Virement bancaire auto',
  prioritySupport: 'Support prioritaire',
} as const

export type PlanKey = keyof typeof PLANS
export type FeatureKey = keyof typeof FEATURE_LABELS