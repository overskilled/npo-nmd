export type MembershipType = "non-voting" | "voting"

export type ContributionType =
  | "Financial Contribution to the 1st MISSION 237"
  | "Student Sponsorship (1st MISSION 237)"
  | "Make a Donation"
  | "Corporate Partnership"

export type ContributionCategory = "Mission" | "Training" | "Open"

export type PaymentProvider = "pawapay" | "paypal"

export type PaymentStatus = "pending" | "confirmed" | "failed"

export interface AllocationBreakdown {
  mission: number
  training: number
  functioning: number
}

export interface MembershipPricing {
  registrationFee: number
  votingFee: number
  currency: string
}

export const MEMBERSHIP_PRICING: MembershipPricing = {
  registrationFee: 15000,
  votingFee: 65000,
  currency: "XAF",
}

export const EXCHANGE_RATES = {
  XAF_TO_USD: 0.0016,
  XAF_TO_EUR: 0.0015,
}
