// Pawapay supported countries with their mobile money providers
export interface CountryProvider {
  code: string
  name: string
  dialCode: string
  providers: {
    id: string
    name: string
    logo?: string
  }[]
}

export const PAWAPAY_COUNTRIES: CountryProvider[] = [
  {
    code: "CM",
    name: "Cameroon",
    dialCode: "+237",
    providers: [
      { id: "mtn_cm", name: "MTN Mobile Money" },
      { id: "orange_cm", name: "Orange Money" },
    ],
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    dialCode: "+225",
    providers: [
      { id: "mtn_ci", name: "MTN Mobile Money" },
      { id: "orange_ci", name: "Orange Money" },
      { id: "moov_ci", name: "Moov Money" },
      { id: "wave_ci", name: "Wave" },
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    dialCode: "+233",
    providers: [
      { id: "mtn_gh", name: "MTN Mobile Money" },
      { id: "vodafone_gh", name: "Vodafone Cash" },
      { id: "airteltigo_gh", name: "AirtelTigo Money" },
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    providers: [
      { id: "mpesa_ke", name: "M-Pesa" },
      { id: "airtel_ke", name: "Airtel Money" },
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    providers: [
      { id: "mtn_ng", name: "MTN Mobile Money" },
      { id: "airtel_ng", name: "Airtel Money" },
      { id: "9mobile_ng", name: "9mobile" },
    ],
  },
  {
    code: "RW",
    name: "Rwanda",
    dialCode: "+250",
    providers: [
      { id: "mtn_rw", name: "MTN Mobile Money" },
      { id: "airtel_rw", name: "Airtel Money" },
    ],
  },
  {
    code: "SN",
    name: "Senegal",
    dialCode: "+221",
    providers: [
      { id: "orange_sn", name: "Orange Money" },
      { id: "free_sn", name: "Free Money" },
      { id: "wave_sn", name: "Wave" },
    ],
  },
  {
    code: "TZ",
    name: "Tanzania",
    dialCode: "+255",
    providers: [
      { id: "mpesa_tz", name: "M-Pesa" },
      { id: "tigo_tz", name: "Tigo Pesa" },
      { id: "airtel_tz", name: "Airtel Money" },
      { id: "halopesa_tz", name: "Halo Pesa" },
    ],
  },
  {
    code: "UG",
    name: "Uganda",
    dialCode: "+256",
    providers: [
      { id: "mtn_ug", name: "MTN Mobile Money" },
      { id: "airtel_ug", name: "Airtel Money" },
    ],
  },
  {
    code: "ZM",
    name: "Zambia",
    dialCode: "+260",
    providers: [
      { id: "mtn_zm", name: "MTN Mobile Money" },
      { id: "airtel_zm", name: "Airtel Money" },
      { id: "zamtel_zm", name: "Zamtel Kwacha" },
    ],
  },
]

export function getCountryByCode(code: string): CountryProvider | undefined {
  return PAWAPAY_COUNTRIES.find((c) => c.code === code)
}

export function getProvidersByCountry(countryCode: string) {
  const country = getCountryByCode(countryCode)
  return country?.providers || []
}
