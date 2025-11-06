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
import { Checkbox } from "@/components/ui/checkbox"
import { Info, Heart, GraduationCap, HandHeart } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { calculateAllocation, formatCurrency, formatDualCurrency } from "@/lib/allocate"
import { ContributionCategory } from "@/lib/types"

export default function ContributePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [contributionType, setContributionType] = useState<"unit" | "training" | "donation">("unit")
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [createNmdAccount, setCreateNmdAccount] = useState(false)

  // Predefined donation amounts for quick selection
  const QUICK_DONATION_AMOUNTS = [1000, 2000, 5000, 10000, 15000, 25000, 50000, 100000]

  const CONTRIBUTION_AMOUNTS = {
    unit: 655000, // Contribution unit: $1,000 USD
    training: 655000, // Sponsorship for design training: $1,000 USD
    donation: 15000, // Suggested donation: $25 USD
  }

  // Allocation categories mapped to contribution types
  const ALLOCATION_MAPPING = {
    unit: {
      id: "Mission" as ContributionCategory,
      name: "Mission Work",
      description: "75% to mission activities, 25% to operations",
      icon: Heart
    },
    training: {
      id: "Training" as ContributionCategory,
      name: "Training & Education",
      description: "90% to training programs, 10% to operations",
      icon: GraduationCap
    },
    donation: {
      id: "Open" as ContributionCategory,
      name: "Balanced Support",
      description: "30% mission, 45% training, 25% operations",
      icon: HandHeart
    }
  }

  const getFinalAmount = () => {
    if (contributionType === "donation") {
      const amount = customAmount ? Number.parseFloat(customAmount) : Number.parseFloat(donationAmount)
      return amount > 0 ? amount : 0
    }
    return CONTRIBUTION_AMOUNTS[contributionType]
  }

  const getSelectedCategory = (): ContributionCategory => {
    return ALLOCATION_MAPPING[contributionType].id
  }

  const allocation = getFinalAmount() > 0 ? calculateAllocation(getSelectedCategory(), getFinalAmount()) : null

  const handleQuickAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString())
    setCustomAmount("")
  }

  const handleProceedToPayment = () => {
    // if (!user) {
    //   router.push("/login")
    //   return
    // }

    const finalAmount = getFinalAmount()
    if (!finalAmount || finalAmount <= 0) {
      return
    }

    const params = new URLSearchParams({
      type: 'contribution',
      category: getSelectedCategory(),
      amount: finalAmount.toString(),
      createNmdAccount: createNmdAccount.toString()
    })

    router.push(`/payment?${params.toString()}`)
  }

  const showNmdAccountOption = contributionType === "donation" && getFinalAmount() >= 15000

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Make a Contribution</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose how you want to support our mission
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contribution Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Contribution</CardTitle>
                  <CardDescription>Select how you'd like to support our work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={contributionType}
                    onValueChange={(value) => setContributionType(value as "unit" | "training" | "donation")}
                  >
                    {/* Contribution Unit */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${contributionType === "unit"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                        }`}
                      onClick={() => setContributionType("unit")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <RadioGroupItem value="unit" id="unit" />
                            <div>
                              <div className="font-semibold">Contribution Unit</div>
                              <p className="text-sm text-muted-foreground">
                                {formatDualCurrency(CONTRIBUTION_AMOUNTS.unit)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                            <Heart className="h-4 w-4" />
                            <span>75% mission activities, 25% operations</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Training Sponsorship */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${contributionType === "training"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                        }`}
                      onClick={() => setContributionType("training")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <RadioGroupItem value="training" id="training" />
                            <div>
                              <div className="font-semibold">Sponsor a Student</div>
                              <p className="text-sm text-muted-foreground">
                                {formatDualCurrency(CONTRIBUTION_AMOUNTS.training)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                            <GraduationCap className="h-4 w-4" />
                            <span>90% training programs, 10% operations</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Donation */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${contributionType === "donation"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                        }`}
                      onClick={() => setContributionType("donation")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <RadioGroupItem value="donation" id="donation" />
                            <div>
                              <div className="font-semibold">Make a Donation</div>
                              <p className="text-sm text-muted-foreground">
                                Choose any amount
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                            <HandHeart className="h-4 w-4" />
                            <span>30% mission, 45% training, 25% operations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Donation Amount Selection */}
                  {contributionType === "donation" && (
                    <div className="space-y-4 pt-4 border-t">
                      <Label>Quick Select Amount (XAF)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {QUICK_DONATION_AMOUNTS.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={donationAmount === amount.toString() ? "default" : "outline"}
                            className="h-10 text-sm"
                            onClick={() => handleQuickAmountSelect(amount)}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="custom-amount">Or Enter Custom Amount (XAF)</Label>
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="Enter amount in XAF"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setDonationAmount("")
                          }}
                          min="1"
                          step="0.01"
                        />
                      </div>

                      {/* NMD Account Option */}
                      {showNmdAccountOption && (
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border">
                          <Checkbox
                            id="nmd-account"
                            checked={createNmdAccount}
                            onCheckedChange={(checked) => setCreateNmdAccount(checked as boolean)}
                          />
                          <Label htmlFor="nmd-account" className="text-sm cursor-pointer">
                            Create an NMD account with this contribution
                            <span className="block text-xs text-muted-foreground font-normal">
                              Your contribution of {getFinalAmount()}XAF or more qualifies you for an NMD membership account
                            </span>
                          </Label>
                        </div>
                      )}
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

            {/* Allocation Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Contribution Summary</CardTitle>
                  <CardDescription>See how your support makes an impact</CardDescription>
                </CardHeader>
                <CardContent>
                  {allocation ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Total Contribution</div>
                        <div className="text-2xl font-bold">{formatCurrency(getFinalAmount())}</div>
                        <div className="text-sm text-muted-foreground mt-1">{formatDualCurrency(getFinalAmount())}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium mb-2">Allocation Breakdown:</div>

                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-primary" />
                            <span>Mission Work</span>
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
                            <span>Training & Education</span>
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
                            <span>Operations</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(allocation.functioning)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDualCurrency(allocation.functioning)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {showNmdAccountOption && createNmdAccount && (
                        <div className="p-3 bg-blue-50 rounded-lg border">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                            <Info className="h-4 w-4" />
                            <span>NMD Account Included</span>
                          </div>
                          <p className="text-xs text-blue-700 mt-1">
                            Your NMD membership account will be created after successful payment
                          </p>
                        </div>
                      )}

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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}