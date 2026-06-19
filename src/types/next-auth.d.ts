declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    role: 'OWNER' | 'MANAGER'
    plan: 'FREE' | 'PRO' | 'AGENCY'
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'OWNER' | 'MANAGER'
      plan: 'FREE' | 'PRO' | 'AGENCY'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'OWNER' | 'MANAGER'
    plan: 'FREE' | 'PRO' | 'AGENCY'
  }
}