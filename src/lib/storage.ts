// Client-side data storage using localStorage

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  createdAt: string
  isAdmin: boolean
}

export interface Member {
  id: string
  userId: string
  memberNumber?: string
  membershipType: "non-voting" | "voting"
  registrationDate: string
  votingRightsDate?: string
  status: "active" | "inactive"
  userInfo?: any
}

export interface Contribution {
  id: string
  email?: string
  displayName: string
  userId: string
  category: "Mission" | "Training" | "Open"
  amount: number
  currency: string
  paymentProvider: "pawapay" | "paypal"
  paymentStatus: "pending" | "confirmed" | "failed"
  transactionId: string
  createdAt: string
  allocation: {
    mission: number
    training: number
    functioning: number
  }
  userInfo: any
}

export interface Payment {
  id: string
  userId: string
  contributionId?: string
  amount: number
  currency: string
  provider: "pawapay" | "paypal"
  status: "pending" | "confirmed" | "failed"
  transactionId: string
  phoneNumber?: string
  email?: string
  createdAt: string
  userInfo: any
}

// Storage keys
const USERS_KEY = "nmd_users"
const MEMBERS_KEY = "nmd_members"
const CONTRIBUTIONS_KEY = "nmd_contributions"
const PAYMENTS_KEY = "nmd_payments"
const CURRENT_USER_KEY = "nmd_current_user"

// Initialize storage with admin user
export function initializeStorage() {
  if (typeof window === "undefined") return

  const users = getUsers()
  if (users.length === 0) {
    const dummyUsers: User[] = [
      {
        id: "admin-1",
        email: "admin@nmd.org",
        password: "admin123",
        name: "Admin User",
        phone: "+237600000000",
        createdAt: new Date().toISOString(),
        isAdmin: true,
      },
      {
        id: "user-1",
        email: "john@example.com",
        password: "password123",
        name: "John Doe",
        phone: "+237677123456",
        createdAt: new Date().toISOString(),
        isAdmin: false,
      },
      {
        id: "user-2",
        email: "marie@example.com",
        password: "password123",
        name: "Marie Kamga",
        phone: "+237699876543",
        createdAt: new Date().toISOString(),
        isAdmin: false,
      },
      {
        id: "user-3",
        email: "paul@example.com",
        password: "password123",
        name: "Paul Mbarga",
        phone: "+237655234567",
        createdAt: new Date().toISOString(),
        isAdmin: false,
      },
    ]

    dummyUsers.forEach((user) => saveUser(user))

    const dummyMembers: Member[] = [
      {
        id: "member-1",
        userId: "user-1",
        membershipType: "voting",
        registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        votingRightsDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
      {
        id: "member-2",
        userId: "user-2",
        membershipType: "non-voting",
        registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
    ]

    dummyMembers.forEach((member) => saveMember(member))
  }
}

// User operations
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveUser(user: User) {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

// Member operations
export function getMembers(): Member[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(MEMBERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveMember(member: Member) {
  const members = getMembers()
  const existingIndex = members.findIndex((m) => m.id === member.id)
  if (existingIndex >= 0) {
    members[existingIndex] = member
  } else {
    members.push(member)
  }
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members))
}

export function getMemberByUserId(userId: string): Member | null {
  const members = getMembers()
  return members.find((m) => m.userId === userId) || null
}

// Contribution operations
export function getContributions(): Contribution[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CONTRIBUTIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveContribution(contribution: Contribution) {
  const contributions = getContributions()
  contributions.push(contribution)
  localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions))
}

export function getContributionsByUserId(userId: string): Contribution[] {
  const contributions = getContributions()
  return contributions.filter((c) => c.userId === userId)
}

// Payment operations
export function getPayments(): Payment[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(PAYMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function savePayment(payment: Payment) {
  const payments = getPayments()
  payments.push(payment)
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))
}

export function getPaymentsByUserId(userId: string): Payment[] {
  const payments = getPayments()
  return payments.filter((p) => p.userId === userId)
}

// Current user session
export function setCurrentUser(userId: string) {
  localStorage.setItem(CURRENT_USER_KEY, userId)
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  const userId = getCurrentUserId()
  return userId ? getUserById(userId) : null
}
