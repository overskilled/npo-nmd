"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { ContributionCategory } from "@/lib/types"
import { Smartphone, CreditCard, AlertCircle, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { v4 as uuidv4 } from "uuid"

import { calculateAllocation, formatCurrency, formatDualCurrency } from "@/lib/allocate"
import { CountryProvider, getCountryByCode, PAWAPAY_COUNTRIES } from "@/lib/countries"
import { Contribution, Member, Payment, saveContribution, saveMember, savePayment } from "@/lib/storage"
import { pollTransactionStatus } from "@/lib/pawapay/poll-transaction"
import { nanoid } from "nanoid"
import { setToCollection } from "@/functions/add-to-collection"
import PaypalButtonWrapper from "@/components/paypalButtonWrapper"
import Link from "next/link"

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
    const [showPassword, setShowPassword] = useState(false)
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: user?.email || "",
        password: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
        payment: ""
    })

    // Get currency based on selected country
    const getCurrencyForCountry = (countryCode: string): string => {
        const currencyMap: { [key: string]: string } = {
            'BEN': 'XOF', 'BFA': 'XOF', 'CIV': 'XOF', 'SEN': 'XOF', // West Africa CFA
            'CMR': 'XAF', 'COD': 'CDF', 'COG': 'XAF', 'GAB': 'XAF', // Central Africa
            'KEN': 'KES', 'RWA': 'RWF', 'UGA': 'UGX', 'ZMB': 'ZMW', // East/South Africa
            'SLE': 'SLE' // Sierra Leone
        }
        return currencyMap[countryCode] || 'XAF'
    }

    // Validate all form fields
    const validateFields = () => {
        let valid = true
        const newErrors = { name: "", email: "", password: "", terms: "", payment: "" }

        // Name validation
        if (!userInfo.name.trim()) {
            newErrors.name = "Name is required."
            valid = false
        } else if (userInfo.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters."
            valid = false
        }

        // Email validation
        if (!userInfo.email.trim()) {
            newErrors.email = "Email is required."
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
            newErrors.email = "Enter a valid email address."
            valid = false
        }

        // Password validation
        if (!userInfo.password.trim()) {
            newErrors.password = "Password is required."
            valid = false
        } else if (userInfo.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters."
            valid = false
        }

        // Terms and conditions validation
        if (!agreeToTerms) {
            newErrors.terms = "You must agree to the terms and conditions and privacy policy."
            valid = false
        }

        // Payment method specific validation
        if (paymentMethod === "pawapay") {
            if (!phoneNumber.trim()) {
                newErrors.payment = "Phone number is required for mobile money payments."
                valid = false
            } else if (!/^\d+$/.test(phoneNumber.replace(/\s/g, ''))) {
                newErrors.payment = "Please enter a valid phone number."
                valid = false
            } else if (phoneNumber.replace(/\s/g, '').length < 8) {
                newErrors.payment = "Phone number must be at least 8 digits."
                valid = false
            }
            if (!mobileProvider) {
                newErrors.payment = "Please select a mobile provider."
                valid = false
            }
        } else if (paymentMethod === "paypal") {
            if (!email.trim()) {
                newErrors.payment = "Email is required for PayPal payments."
                valid = false
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newErrors.payment = "Please enter a valid email address for PayPal."
                valid = false
            }
        }

        setErrors(newErrors)
        return valid
    }

    // Add this function near your other helper functions
    const handlePawaPayError = (error: any, depositData: any) => {
        console.error('PawaPay payment failed:', error);

        // Extract failure reason from PawaPay response
        const failureReason = error?.data?.failureReason || error?.failureReason;
        const failureCode = failureReason?.failureCode;
        const failureMessage = failureReason?.failureMessage || error?.message;

        let userFriendlyMessage = 'Payment failed. Please try again.';

        // Handle specific PawaPay error codes
        switch (failureCode) {
            case 'INSUFFICIENT_BALANCE':
                userFriendlyMessage = 'Insufficient balance in your mobile money account. Please top up and try again.';
                break;
            case 'TRANSACTION_LIMIT_EXCEEDED':
                userFriendlyMessage = 'Transaction amount exceeds your account limit. Please try a smaller amount or contact your mobile provider.';
                break;
            case 'INVALID_ACCOUNT':
                userFriendlyMessage = 'Invalid phone number or mobile money account. Please check your number and try again.';
                break;
            case 'NETWORK_ERROR':
            case 'TIMEOUT':
                userFriendlyMessage = 'Network error. Please check your connection and try again.';
                break;
            case 'USER_CANCELLED':
                userFriendlyMessage = 'Payment was cancelled. Please try again if you wish to complete the payment.';
                break;
            case 'SERVICE_UNAVAILABLE':
                userFriendlyMessage = 'Mobile money service is temporarily unavailable. Please try again later.';
                break;
            default:
                // Check for generic error messages
                if (failureMessage?.includes('insufficient') || failureMessage?.includes('balance')) {
                    userFriendlyMessage = 'Insufficient balance in your mobile money account. Please top up and try again.';
                } else if (failureMessage?.includes('timeout') || failureMessage?.includes('network')) {
                    userFriendlyMessage = 'Network error. Please check your connection and try again.';
                } else if (failureMessage?.includes('invalid') || failureMessage?.includes('number')) {
                    userFriendlyMessage = 'Invalid phone number. Please check your number and try again.';
                }
        }

        // Log the error for debugging
        console.log('PawaPay Error Details:', {
            failureCode,
            failureMessage,
            depositId: depositData.depositId,
            phoneNumber: depositData.payer.accountDetails.phoneNumber,
            amount: depositData.amount,
            currency: depositData.currency
        });

        return userFriendlyMessage;
    };

    useEffect(() => {
        const country = getCountryByCode(selectedCountry)
        if (country) {
            setAvailableProviders(country.providers)
            setMobileProvider(country.providers[0]?.id || "")
        }
    }, [selectedCountry])

    useEffect(() => {
        if (user?.email) {
            setUserInfo(prev => ({ ...prev, email: user.email ?? "" }))
            setEmail(user.email ?? "")
        }
    }, [user])

    // Redirect if missing required parameters
    useEffect(() => {
        if (!type || !amount || (type === "membership" && !membershipType) || (type === "contribution" && !category)) {
            router.push("/")
        }
    }, [type, amount, membershipType, category, router])

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode)
        const country = getCountryByCode(countryCode)
        if (country) {
            setAvailableProviders(country.providers)
            setMobileProvider(country.providers[0]?.id || "")
            // Clear phone number when country changes to avoid confusion
            setPhoneNumber("")
        }
    }

    const formatPhoneWithCountryCode = (phone: string): string => {
        const country = getCountryByCode(selectedCountry)
        if (!country) return phone

        // Remove any existing country code, spaces, or special characters
        const cleanPhone = phone.replace(/[^\d]/g, "")

        // Remove country code if already included
        const countryCodeDigits = country.dialCode.replace("+", "")
        if (cleanPhone.startsWith(countryCodeDigits)) {
            return `+${cleanPhone}`
        }

        // Otherwise, prepend country code
        return `${country.dialCode}${cleanPhone}`
    }

    // Format phone number for display as user types
    const formatPhoneDisplay = (phone: string): string => {
        const cleanPhone = phone.replace(/[^\d]/g, "")

        // Simple formatting for demonstration - adjust based on country patterns
        if (cleanPhone.length <= 3) return cleanPhone
        if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)}`
    }

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneDisplay(value)
        setPhoneNumber(formatted)
    }

    // PawaPay API integration
    async function createDeposit(depositData: any) {
        try {
            const response = await fetch('https://pro-oasis-462211.oa.r.appspot.com/api/deposits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(depositData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Payment failed: ${response.status} ${errorText}`)
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error('Error creating deposit:', error)
            throw error
        }
    }

    const generateDepositId = () => uuidv4()

    const handlePayment = async () => {
        setError("")
        setErrors(prev => ({ ...prev, payment: "" }))

        if (!validateFields()) {
            return
        }

        setIsProcessing(true)

        try {
            let paymentResult
            const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            const currency = getCurrencyForCountry(selectedCountry)

            if (paymentMethod === "pawapay") {
                const formattedPhone = formatPhoneWithCountryCode(phoneNumber)
                const depositId = generateDepositId()

                console.log("Initiating PawaPay payment with data:", {
                    depositId,
                    phoneNumber: formattedPhone,
                    mobileProvider,
                })

                const depositData = {
                    depositId,
                    payer: {
                        type: "MMO",
                        accountDetails: {
                            phoneNumber: formattedPhone.slice(1),
                            provider: mobileProvider
                        }
                    },
                    clientReferenceId: transactionId,
                    customerMessage: type === "membership" ? `membership` : `contribution`,
                    // amount: "1",
                    amount: amount.toString(),
                    currency,
                    metadata: [
                        {
                            orderId: transactionId,
                            type,
                            category,
                            membershipType,
                            userName: userInfo.name,
                            userEmail: userInfo.email
                        }
                    ]
                }

                paymentResult = await createDeposit(depositData)

                if (paymentResult.status !== "ACCEPTED") {
                    throw new Error(paymentResult.error || "Payment initiation failed.")
                }

                // Poll for confirmation
                const confirmedPayment = await pollTransactionStatus(depositId)

                console.log("PawaPay payment confirmation result on front:", confirmedPayment);

                if (!confirmedPayment) {
                    throw new Error("Payment confirmation timeout. Please check your mobile money account and try again.");
                }

                // Proceed to save data after successful confirmation
                const payment: Payment = {
                    id: `payment-${Date.now()}`,
                    userId: user?.uid || `user-${userInfo.email}`,
                    amount,
                    currency,
                    provider: paymentMethod,
                    status: "confirmed",
                    transactionId: transactionId,
                    phoneNumber: formattedPhone,
                    email: userInfo.email,
                    createdAt: new Date().toISOString(),
                    userInfo: {
                        name: userInfo.name,
                        email: userInfo.email
                    }
                }

                await savePayment(payment)

                if (type === "membership" && membershipType) {
                    const memberId = user?.uid || `user-${Date.now()}`
                    const memberNumber = amount >= 15000 ? generateMemberNumber() : undefined

                    const member: Member = {
                        id: memberId,
                        userId: memberId,
                        memberNumber,
                        membershipType,
                        registrationDate: new Date().toISOString(),
                        votingRightsDate: membershipType === "voting" ? new Date().toISOString() : undefined,
                        status: "active",
                        userInfo: {
                            name: userInfo.name,
                            email: userInfo.email
                        }
                    }

                    try {
                        const response = await fetch("/api/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: userInfo.email,
                                password: userInfo.password,
                                name: userInfo.name,
                                membershipType,
                                contributionAmount: amount
                            }),
                        })

                        const data = await response.json()

                        if (!response.ok) {
                            throw new Error(data.error || "Failed to create member")
                        }

                        await setToCollection("users", data.userId, {
                            uid: data.userId,
                            idNumber: `NMD-ASSO-${nanoid(6)}`,
                            role: "user",
                            ...member,
                        })
                    } catch (error) {
                        console.error("Error creating member:", error)
                        throw error
                    }
                }

                if (type === "contribution" && category) {
                    const allocation = calculateAllocation(category, amount)
                    const contribution: Contribution = {
                        id: `contribution-${Date.now()}`,
                        userId: user?.uid || `user-${userInfo.email}`,
                        category,
                        amount,
                        currency,
                        paymentProvider: paymentMethod,
                        paymentStatus: "confirmed",
                        transactionId: transactionId,
                        createdAt: new Date().toISOString(),
                        allocation,
                        userInfo: {
                            name: userInfo.name,
                            email: userInfo.email
                        }
                    }

                    try {
                        const response = await fetch("/api/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(contribution),
                        })

                        const data = await response.json()

                        if (!response.ok) {
                            throw new Error(data.error || "Failed to create contribution")
                        }
                    } catch (error) {
                        console.error("Error creating contribution:", error)
                        throw error
                    }
                }

                router.push(`/payment/success?transactionId=${transactionId}&type=${type}&amount=${amount}`)
            }

        } catch (error) {
            console.log("Payment error:", error)
            const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again."
            setError(errorMessage)
            setErrors(prev => ({
                ...prev,
                payment: errorMessage
            }))
        } finally {
            setIsProcessing(false)
        }
    }

    const generateMemberNumber = (): string => {
        const min = 10000000
        const max = 99999999
        return Math.floor(Math.random() * (max - min + 1) + min).toString()
    }

    const currentCountry = getCountryByCode(selectedCountry)
    const currency = getCurrencyForCountry(selectedCountry)

    // PayPal button props
    const paypalProps = {
        total: amount,
        disabled: !agreeToTerms || isProcessing || !userInfo.name || !userInfo.email,
        formData: {
            name: userInfo.name,
            email: userInfo.email,
        },
        type: type || "contribution",
        currency: currency,
        description: type === "membership"
            ? `${membershipType === "voting" ? "Voting" : "Non-Voting"} Membership`
            : `${category} Contribution`,
        onPaymentStart: () => setIsProcessing(true),
        onPaymentComplete: async (paymentData: any) => {
            try {
                const transactionId = paymentData.id || `PAYPAL-${Date.now()}`

                if (type === "membership" && membershipType) {
                    const response = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: userInfo.email,
                            password: userInfo.password,
                            name: userInfo.name,
                            membershipType,
                            contributionAmount: amount
                        }),
                    })

                    if (!response.ok) {
                        throw new Error("Failed to create member account")
                    }
                }

                if (type === "contribution" && category) {
                    const response = await fetch("/api/contributions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user?.uid || `user-${userInfo.email}`,
                            category,
                            amount,
                            currency,
                            paymentProvider: "paypal",
                            paymentStatus: "confirmed",
                            transactionId,
                            userInfo: {
                                name: userInfo.name,
                                email: userInfo.email
                            }
                        }),
                    })

                    if (!response.ok) {
                        throw new Error("Failed to record contribution")
                    }
                }

                router.push(`/payment/success?transactionId=${transactionId}&type=${type}&amount=${amount}`)
            } catch (error) {
                console.error("Payment completion error:", error)
                setError("Payment completed but there was an issue recording your transaction. Please contact support.")
            } finally {
                setIsProcessing(false)
            }
        },
        onPaymentError: (error: any) => {
            console.error("PayPal payment error:", error)
            setError("PayPal payment failed. Please try again or use another payment method.")
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 py-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
                        <p className="text-muted-foreground">
                            {type === "membership"
                                ? `${membershipType === "voting" ? "Voting" : "Non-Voting"} Membership Registration`
                                : `${category} Contribution Payment`
                            }
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* User Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                                <CardDescription>
                                    Please provide your details to complete the registration
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            className={errors.name ? "border-red-500" : ""}
                                            disabled={isProcessing}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            className={errors.email ? "border-red-500" : ""}
                                            disabled={isProcessing}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field with Show/Hide */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={userInfo.password}
                                                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                                                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                                disabled={isProcessing}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isProcessing}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.password}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Password must be at least 6 characters long
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Summary Card */}
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
                                        <div className="text-2xl font-bold">{formatCurrency(amount, currency)}</div>
                                        <div className="text-sm text-muted-foreground">{formatDualCurrency(amount)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Payment Method</CardTitle>
                                <CardDescription>Choose how you'd like to pay</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={paymentMethod}
                                    onValueChange={(value) => setPaymentMethod(value as "pawapay" | "paypal")}
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="pawapay" className="gap-2" disabled={isProcessing}>
                                            <Smartphone className="h-4 w-4" />
                                            Mobile Money
                                        </TabsTrigger>
                                        <TabsTrigger value="paypal" className="gap-2" disabled={isProcessing}>
                                            <CreditCard className="h-4 w-4" />
                                            PayPal
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="pawapay" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Country *</Label>
                                            <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={isProcessing}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PAWAPAY_COUNTRIES.map((country) => (
                                                        <SelectItem key={country.code} value={country.code}>
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={country.flag}
                                                                    alt={`${country.name} flag`}
                                                                    className="w-6 h-4 object-cover rounded"
                                                                />
                                                                <span className="flex-1">{country.dialCode} {country.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Mobile Provider *</Label>
                                            <RadioGroup value={mobileProvider} onValueChange={setMobileProvider} disabled={isProcessing}>
                                                {availableProviders.map((provider) => (
                                                    <div key={provider.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                                                        <RadioGroupItem value={provider.id} id={provider.id} disabled={isProcessing} />
                                                        <Label htmlFor={provider.id} className="flex-1 cursor-pointer font-normal">
                                                            {provider.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <div className="flex gap-2">
                                                <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground min-w-[80px] justify-center">
                                                    {currentCountry?.dialCode}
                                                </div>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="6XX XXX XXX"
                                                    value={phoneNumber}
                                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                                    className="flex-1"
                                                    disabled={isProcessing}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                You will receive a prompt on your phone to confirm the payment
                                            </p>
                                        </div>

                                        {/* Mobile Money Payment Button */}
                                        <Button
                                            size="lg"
                                            className="w-full"
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing Payment...
                                                </>
                                            ) : (
                                                `Pay ${formatCurrency(amount, currency)} with Mobile Money`
                                            )}
                                        </Button>
                                    </TabsContent>

                                    <TabsContent value="paypal" className="space-y-4 mt-4">
                                        <PaypalButtonWrapper {...paypalProps} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Terms and Conditions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agreeToTerms}
                                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                        disabled={isProcessing}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I agree to the{" "}
                                            <Link
                                                href="/terms-of-service"
                                                className="text-primary hover:underline inline-flex items-center"
                                                target="_blank"
                                            >
                                                Terms of Service
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy-policy"
                                                className="text-primary hover:underline inline-flex items-center"
                                                target="_blank"
                                            >
                                                Privacy Policy
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </Link>
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            By proceeding, you agree to our legal terms and conditions.
                                        </p>
                                        {errors.terms && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.terms}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Display */}
                        {(error || errors.payment) && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error || errors.payment}</AlertDescription>
                            </Alert>
                        )}

                        {/* Security Notice */}
                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-700">
                                <strong>Secure Payment:</strong> All transactions are encrypted and secure.
                                We never store your payment details.
                            </AlertDescription>
                        </Alert>
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
                    <span className="ml-2">Loading payment page...</span>
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    )
}