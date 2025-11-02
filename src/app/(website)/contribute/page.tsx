"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Heart, GraduationCap, HandHeart } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { calculateAllocation, formatCurrency, formatDualCurrency } from "@/lib/allocate"
import { ContributionCategory } from "@/lib/types"

export default function ContributePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [category, setCategory] = useState<ContributionCategory>("Mission")
  const [contributionType, setContributionType] = useState<"unit" | "training" | "donation">("unit")
  const [donationAmount, setDonationAmount] = useState("")

  const CONTRIBUTION_AMOUNTS = {
    unit: 655000, // Contribution unit: 655,000 XAF
    training: 655000, // Sponsorship for design training: 655,000 XAF
    donation: 15000, // Minimum donation: 15,000 XAF
  }

  const getFinalAmount = () => {
    if (contributionType === "donation") {
      const amount = Number.parseFloat(donationAmount)
      return amount >= 15000 ? amount : 0
    }
    return CONTRIBUTION_AMOUNTS[contributionType]
  }

  const allocation = getFinalAmount() > 0 ? calculateAllocation(category, getFinalAmount()) : null

  const handleProceedToPayment = () => {
    // if (!user) {
    //   router.push("/login")
    //   return
    // }

    const finalAmount = getFinalAmount()
    if (!finalAmount || finalAmount <= 0) {
      return
    }

    router.push(`/payment?type=contribution&category=${category}&amount=${finalAmount}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Make a Contribution</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Support our mission through transparent, purpose-driven contributions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contribution Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Contribution Type</CardTitle>
                  <CardDescription>Select your contribution option</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={contributionType}
                    onValueChange={(value) => setContributionType(value as "unit" | "training" | "donation")}
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="unit" id="unit" className="mt-1" />
                      <Label htmlFor="unit" className="flex-1 cursor-pointer">
                        <div className="font-semibold mb-1">Contribution Unit</div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDualCurrency(CONTRIBUTION_AMOUNTS.unit)}
                        </p>
                        <p className="text-xs text-muted-foreground">Standard contribution unit for mission support</p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="training" id="training" className="mt-1" />
                      <Label htmlFor="training" className="flex-1 cursor-pointer">
                        <div className="font-semibold mb-1">Sponsorship for Design Training</div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDualCurrency(CONTRIBUTION_AMOUNTS.training)}
                        </p>
                        <p className="text-xs text-muted-foreground">Sponsor a student's design training program</p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="donation" id="donation" className="mt-1" />
                      <Label htmlFor="donation" className="flex-1 cursor-pointer">
                        <div className="font-semibold mb-1">Make a Donation</div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Starting at {formatDualCurrency(CONTRIBUTION_AMOUNTS.donation)}
                        </p>
                        <p className="text-xs text-muted-foreground">Custom amount to support our work</p>
                      </Label>
                    </div>
                  </RadioGroup>

                  {contributionType === "donation" && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="donation-amount">Donation Amount (XAF)</Label>
                      <Input
                        id="donation-amount"
                        type="number"
                        placeholder="Minimum 15,000 XAF"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        min="15000"
                      />
                      {donationAmount && Number.parseFloat(donationAmount) < 15000 && (
                        <p className="text-sm text-destructive">Minimum donation is {formatDualCurrency(15000)}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Choose Contribution Category</CardTitle>
                  <CardDescription>Select where you'd like your contribution to make an impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={category} onValueChange={(value) => setCategory(value as ContributionCategory)}>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="Mission" id="mission" className="mt-1" />
                      <Label htmlFor="mission" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Mission Work</span>
                        </div>
                        <p className="text-sm text-muted-foreground">75% to mission activities, 25% to operations</p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="Training" id="training-cat" className="mt-1" />
                      <Label htmlFor="training-cat" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Training & Education</span>
                        </div>
                        <p className="text-sm text-muted-foreground">90% to training programs, 10% to operations</p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="Open" id="open" className="mt-1" />
                      <Label htmlFor="open" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <HandHeart className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Open Contribution</span>
                        </div>
                        <p className="text-sm text-muted-foreground">30% mission, 45% training, 25% operations</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Allocation Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allocation Breakdown</CardTitle>
                  <CardDescription>See how your contribution will be distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  {allocation ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Total Contribution</div>
                        <div className="text-2xl font-bold">{formatCurrency(getFinalAmount())}</div>
                        <div className="text-sm text-muted-foreground mt-1">{formatDualCurrency(getFinalAmount())}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-primary" />
                            <span className="font-medium">Mission Work</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(allocation.mission)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDualCurrency(allocation.mission)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-medium">Training & Education</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(allocation.training)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDualCurrency(allocation.training)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <HandHeart className="h-4 w-4 text-primary" />
                            <span className="font-medium">Operations</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(allocation.functioning)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDualCurrency(allocation.functioning)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleProceedToPayment}
                        disabled={!getFinalAmount() || getFinalAmount() <= 0}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>
                        {contributionType === "donation"
                          ? "Enter a donation amount to see the allocation"
                          : "Select a contribution type to see the allocation"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  All contributions are transparent and tracked. You'll receive a detailed receipt showing exactly how
                  your contribution is allocated.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
