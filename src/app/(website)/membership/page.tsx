"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getMemberByUserId } from "@/lib/storage"
import { Check, AlertCircle } from "lucide-react"
import { formatCurrency, formatDualCurrency, MEMBERSHIP_PRICING } from "@/lib/allocate"
import { useAuth } from "@/context/auth-context"

export default function MembershipPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<"non-voting" | "voting" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleSelectMembership = async (type: "non-voting" | "voting") => {
    // if (!user) {
    //   router.push("/login")
    //   return
    // }

    // Check if user is already a member
    // const existingMember = getMemberByUserId(user?.uid!)
    // if (existingMember) {
    //   setError("You are already a member")
    //   return
    // }

    setSelectedType(type)
    setError("")
  }

  const handleProceedToPayment = () => {
    if (!selectedType) return

    const amount =
      selectedType === "voting"
        ? MEMBERSHIP_PRICING.registrationFee + MEMBERSHIP_PRICING.votingFee
        : MEMBERSHIP_PRICING.registrationFee

    router.push(`/payment?type=membership&membershipType=${selectedType}&amount=${amount}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Membership Options</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the membership type that best fits your goals and commitment level
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Non-Voting Membership */}
            <Card className={selectedType === "non-voting" ? "border-blue-500 border-1" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Non-Voting Member</CardTitle>
                  <Badge variant="secondary">Basic</Badge>
                </div>
                <CardDescription>Join our community and support our mission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1">{formatCurrency(MEMBERSHIP_PRICING.registrationFee)}</div>
                  <p className="text-sm text-muted-foreground">
                    {formatDualCurrency(MEMBERSHIP_PRICING.registrationFee)}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Access to member resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Participate in community events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Receive newsletters and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Access to NMD Courses</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={selectedType === "non-voting" ? "default" : "outline"}
                  onClick={() => handleSelectMembership("non-voting")}
                >
                  {selectedType === "non-voting" ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>

            {/* Voting Membership */}
            <Card className={selectedType === "voting" ? "border-blue-500 border-2" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Voting Member</CardTitle>
                  <Badge>Premium</Badge>
                </div>
                <CardDescription>Full membership with voting rights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1">
                    {formatCurrency(MEMBERSHIP_PRICING.registrationFee + MEMBERSHIP_PRICING.votingFee)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDualCurrency(MEMBERSHIP_PRICING.registrationFee + MEMBERSHIP_PRICING.votingFee)}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">All non-voting member benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Voting rights in association decisions</span>
                  </li>
                </ul>

                <div className="w-50 h-16">

                </div>

                <Button
                  className="w-full"
                  variant={selectedType === "voting" ? "default" : "outline"}
                  onClick={() => handleSelectMembership("voting")}
                >
                  {selectedType === "voting" ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {selectedType && (
            <div className="flex justify-center">
              <Button size="lg" onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Membership Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Membership is valid for life once registered</li>
              <li>• Voting rights are granted immediately upon payment confirmation</li>
              <li>• All fees are non-refundable</li>
              <li>• Members can upgrade from non-voting to voting at any time</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
