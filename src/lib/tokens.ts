import { randomBytes } from 'crypto'

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function isValidToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token)
}

export function buildTenantPortalUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/portal/${token}`
}

export function buildOwnerPortalUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/owner/${token}`
}