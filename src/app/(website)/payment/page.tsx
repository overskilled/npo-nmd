"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContributionCategory } from "@/lib/types"
import { Smartphone, CreditCard, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { calculateAllocation, formatCurrency, formatDualCurrency } from "@/lib/allocate"
import { CountryProvider, getCountryByCode, PAWAPAY_COUNTRIES } from "@/lib/countries"
import { Contribution, Member, Payment, saveContribution, saveMember, savePayment } from "@/lib/storage"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const type = searchParams.get("type")
  const amount = Number.parseFloat(searchParams.get("amount") || "0")
  const membershipType = searchParams.get("membershipType") as "non-voting" | "voting" | null
  const category = searchParams.get("category") as ContributionCategory | null

  const [paymentMethod, setPaymentMethod] = useState<"pawapay" | "paypal">("pawapay")
  const [selectedCountry, setSelectedCountry] = useState<string>("CM")
  const [availableProviders, setAvailableProviders] = useState<CountryProvider["providers"]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const [mobileProvider, setMobileProvider] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const country = getCountryByCode(selectedCountry)
    if (country) {
      setAvailableProviders(country.providers)
      setMobileProvider(country.providers[0]?.id || "")
    }
  }, [selectedCountry])


//   useEffect(() => {
//   }, [user, router])

//   if (!user || !type || !amount) {
//     return null
//   }

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    const country = getCountryByCode(countryCode)
    if (country) {
      setAvailableProviders(country.providers)
      setMobileProvider(country.providers[0]?.id || "")
      // Clear phone number when country changes
      setPhoneNumber("")
    }
  }

  const formatPhoneWithCountryCode = (phone: string): string => {
    const country = getCountryByCode(selectedCountry)
    if (!country) return phone

    // Remove any existing country code or special characters
    const cleanPhone = phone.replace(/[^\d]/g, "")

    // If phone already starts with country code (without +), return with +
    if (cleanPhone.startsWith(country.dialCode.replace("+", ""))) {
      return `+${cleanPhone}`
    }

    // Otherwise, prepend country code
    return `${country.dialCode}${cleanPhone}`
  }

  const handlePayment = async () => {
    setError("")
    setIsProcessing(true)

    if (paymentMethod === "pawapay" && !phoneNumber) {
      setError("Please enter your phone number")
      setIsProcessing(false)
      return
    }

    if (paymentMethod === "paypal" && !email) {
      setError("Please enter your email")
      setIsProcessing(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isSuccess = Math.random() > 0.1

    if (!isSuccess) {
      setError("Payment failed. Please try again.")
      setIsProcessing(false)
      return
    }

    const formattedPhone = paymentMethod === "pawapay" ? formatPhoneWithCountryCode(phoneNumber) : undefined

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const payment: Payment = {
      id: `payment-${Date.now()}`,
      userId: user?.uid!,
      amount,
      currency: "XAF",
      provider: paymentMethod,
      status: "confirmed",
      transactionId,
      phoneNumber: formattedPhone,
      email: paymentMethod === "paypal" ? email : undefined,
      createdAt: new Date().toISOString(),
    }

    savePayment(payment)

    if (type === "membership" && membershipType) {
      const member: Member = {
        id: `member-${Date.now()}`,
        userId: user?.uid!,
        membershipType,
        registrationDate: new Date().toISOString(),
        votingRightsDate: membershipType === "voting" ? new Date().toISOString() : undefined,
        status: "active",
      }
      saveMember(member)
    }

    if (type === "contribution" && category) {
      const allocation = calculateAllocation(category, amount)
      const contribution: Contribution = {
        id: `contribution-${Date.now()}`,
        userId: user?.uid!,
        category,
        amount,
        currency: "XAF",
        paymentProvider: paymentMethod,
        paymentStatus: "confirmed",
        transactionId,
        createdAt: new Date().toISOString(),
        allocation,
      }
      saveContribution(contribution)
    }

    router.push(`/payment/success?transactionId=${transactionId}&type=${type}`)
  }

  const currentCountry = getCountryByCode(selectedCountry)

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">
              {type === "membership" ? "Membership Registration" : "Contribution Payment"}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {type === "membership"
                        ? `${membershipType === "voting" ? "Voting" : "Non-Voting"} Membership`
                        : `${category} Contribution`}
                    </div>
                    <div className="text-sm text-muted-foreground">One-time payment</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
                    <div className="text-sm text-muted-foreground">{formatDualCurrency(amount)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose how you'd like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "pawapay" | "paypal")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pawapay" className="gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      PayPal
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pawapay" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={selectedCountry} onValueChange={handleCountryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAWAPAY_COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.dialCode} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Mobile Provider</Label>
                      <RadioGroup value={mobileProvider} onValueChange={setMobileProvider}>
                        {availableProviders.map((provider) => (
                          <div key={provider.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value={provider.id} id={provider.id} />
                            <Label htmlFor={provider.id} className="flex-1 cursor-pointer font-normal">
                              {provider.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground min-w-[80px] justify-center">
                          {currentCountry?.dialCode}
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="6XX XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You will receive a prompt on your phone to confirm the payment
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">PayPal Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        You will be redirected to PayPal to complete the payment
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button size="lg" className="w-full" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${formatDualCurrency(amount)}`
              )}
            </Button>

            {/* <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a simulated payment system for demonstration purposes. No real transactions will be processed.
              </AlertDescription>
            </Alert> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
