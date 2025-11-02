import { AllocationBreakdown } from "./types"
import { ContributionCategory } from "./types"

export const MEMBERSHIP_PRICING = {
    registrationFee: 15000,
    votingFee: 65000,
    currency: "XAF",
}

/**
 * Calculate allocation breakdown based on category and amount
 *
 * Mission: 75% mission, 25% functioning
 * Training: 90% training, 10% functioning
 * Open: 30% mission, 45% training, 25% functioning
 */
export function calculateAllocation(category: ContributionCategory, amount: number): AllocationBreakdown {
    let mission = 0
    let training = 0
    let functioning = 0

    switch (category) {
        case "Mission":
            mission = amount * 0.75
            functioning = amount * 0.25
            break
        case "Training":
            training = amount * 0.9
            functioning = amount * 0.1
            break
        case "Open":
            mission = amount * 0.3
            training = amount * 0.45
            functioning = amount * 0.25
            break
    }

    return {
        mission: Math.round(mission * 100) / 100,
        training: Math.round(training * 100) / 100,
        functioning: Math.round(functioning * 100) / 100,
    }
}

export const XAF_TO_EUR_RATE = 655.957 // 1 EUR = 655.957 XAF (fixed rate)

export function formatCurrency(amount: number, currency = "XAF"): string {
    if (currency === "XAF") {
        return `${amount.toLocaleString()} XAF`
    } else if (currency === "USD") {
        return `$${amount.toLocaleString()}`
    } else if (currency === "EUR") {
        return `€${amount.toLocaleString()}`
    }
    return `${amount.toLocaleString()} ${currency}`
}

export function formatDualCurrency(amountXAF: number): string {
    const amountEUR = Math.round((amountXAF / XAF_TO_EUR_RATE) * 100) / 100
    return `${amountXAF.toLocaleString()} XAF | €${amountEUR.toLocaleString()}`
}

export function convertEURtoXAF(amountEUR: number): number {
    return Math.round(amountEUR * XAF_TO_EUR_RATE)
}

export function convertXAFtoEUR(amountXAF: number): number {
    return Math.round((amountXAF / XAF_TO_EUR_RATE) * 100) / 100
}
