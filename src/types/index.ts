export type Role = 'OWNER' | 'MANAGER'
export type Plan = 'FREE' | 'PRO' | 'AGENCY'
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL'
export type ContractStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED'
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'LATE'
export type PaymentMethod = 'MOBILE_MONEY' | 'CASH' | 'BANK_TRANSFER'

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: Role
  plan: Plan
  createdAt: Date
  updatedAt: Date
}

export type Owner = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  token: string
  managerId: string
  createdAt: Date
  updatedAt: Date
}

export type Property = {
  id: string
  name: string
  address: string
  city: string
  type: PropertyType
  rentAmount: number
  userId?: string | null
  ownerId?: string | null
  createdAt: Date
  updatedAt: Date
}

export type IdType = 'CNI' | 'PASSPORT' | 'RESIDENCE_PERMIT' | 'VOTER_CARD'

export type Tenant = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  dateOfBirth?: Date | null
  placeOfBirth?: string | null
  nationality?: string | null
  idType?: IdType | null
  idNumber?: string | null
  token: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type Contract = {
  id: string
  startDate: Date
  endDate?: Date | null
  rentAmount: number
  deposit?: number | null
  status: ContractStatus
  userId: string
  tenantId: string
  propertyId: string
  createdAt: Date
  updatedAt: Date
}

export type Payment = {
  id: string
  amount: number
  expectedAmount: number
  status: PaymentStatus
  method: PaymentMethod
  dueDate: Date
  paidAt?: Date | null
  commission?: number | null
  tenantId: string
  contractId: string
  createdAt: Date
  updatedAt: Date
}

export type TenantWithRelations = Tenant & {
  property: Property
  contracts: Contract[]
  payments: Payment[]
}

export type PropertyWithRelations = Property & {
  contracts: (Contract & { tenant: Tenant })[]
  owner?: Owner | null
  user?: User | null
}

export type ContractWithRelations = Contract & {
  tenant: Tenant
  property: Property
}

export type PaymentWithRelations = Payment & {
  tenant: TenantWithRelations
}

export type OwnerWithRelations = Owner & {
  properties: Property[]
  manager: User
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
  plan: Plan
}