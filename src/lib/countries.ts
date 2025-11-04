// Pawapay supported countries with their mobile money providers
export interface CountryProvider {
  code: string;
  name: string;
  dialCode: string;
  flag?: string;
  providers: {
    id: string;
    name: string;
  }[];
}

export const PAWAPAY_COUNTRIES: CountryProvider[] = [
    {
        code: "BEN",
        name: "Benin",
        dialCode: "+229",
        flag: "https://static-content.pawapay.io/country_flags/ben.svg",
        providers: [
            { id: "MOOV_BEN", name: "Moov" },
            { id: "MTN_MOMO_BEN", name: "MTN" },
        ],
    },
    {
        code: "BFA",
        name: "Burkina Faso",
        dialCode: "+226",
        flag: "https://static-content.pawapay.io/country_flags/bfa.svg",
        providers: [
            { id: "MOOV_BFA", name: "Moov" },
            { id: "ORANGE_BFA", name: "Orange" },
        ],
    },
    {
        code: "CIV",
        name: "Ivory Coast",
        dialCode: "+225",
        flag: "https://static-content.pawapay.io/country_flags/civ.svg",
        providers: [
            { id: "MTN_MOMO_CIV", name: "MTN" },
            { id: "ORANGE_CIV", name: "Orange" },
        ],
    },
    {
        code: "CMR",
        name: "Cameroon",
        dialCode: "+237",
        flag: "https://static-content.pawapay.io/country_flags/cmr.svg",
        providers: [
            { id: "MTN_MOMO_CMR", name: "MTN" },
            { id: "ORANGE_CMR", name: "Orange" },
        ],
    },
    {
        code: "COD",
        name: "Democratic Republic of the Congo",
        dialCode: "+243",
        flag: "https://static-content.pawapay.io/country_flags/cod.svg",
        providers: [
            { id: "AIRTEL_COD", name: "Airtel" },
            { id: "ORANGE_COD", name: "Orange" },
            { id: "VODACOM_MPESA_COD", name: "Vodacom" },
        ],
    },
    {
        code: "COG",
        name: "Congo",
        dialCode: "+242",
        flag: "https://static-content.pawapay.io/country_flags/cog.svg",
        providers: [
            { id: "AIRTEL_COG", name: "Airtel" },
            { id: "MTN_MOMO_COG", name: "MTN" },
        ],
    },
    {
        code: "GAB",
        name: "Gabon",
        dialCode: "+241",
        flag: "https://static-content.pawapay.io/country_flags/gab.svg",
        providers: [
            { id: "AIRTEL_GAB", name: "Airtel" },
        ],
    },
    {
        code: "KEN",
        name: "Kenya",
        dialCode: "+254",
        flag: "https://static-content.pawapay.io/country_flags/ken.svg",
        providers: [
            { id: "MPESA_KEN", name: "Safaricom" },
        ],
    },
    {
        code: "RWA",
        name: "Rwanda",
        dialCode: "+250",
        flag: "https://static-content.pawapay.io/country_flags/rwa.svg",
        providers: [
            { id: "AIRTEL_RWA", name: "Airtel" },
            { id: "MTN_MOMO_RWA", name: "MTN" },
        ],
    },
    {
        code: "SEN",
        name: "Senegal",
        dialCode: "+221",
        flag: "https://static-content.pawapay.io/country_flags/sen.svg",
        providers: [
            { id: "FREE_SEN", name: "Free" },
            { id: "ORANGE_SEN", name: "Orange" },
        ],
    },
    {
        code: "SLE",
        name: "Sierra Leone",
        dialCode: "+232",
        flag: "https://static-content.pawapay.io/country_flags/sle.svg",
        providers: [
            { id: "ORANGE_SLE", name: "Orange" },
        ],
    },
    {
        code: "UGA",
        name: "Uganda",
        dialCode: "+256",
        flag: "https://static-content.pawapay.io/country_flags/uga.svg",
        providers: [
            { id: "AIRTEL_OAPI_UGA", name: "Airtel" },
            { id: "MTN_MOMO_UGA", name: "MTN" },
        ],
    },
    {
        code: "ZMB",
        name: "Zambia",
        dialCode: "+260",
        flag: "https://static-content.pawapay.io/country_flags/zmb.svg",
        providers: [
            { id: "MTN_MOMO_ZMB", name: "MTN" },
            { id: "ZAMTEL_ZMB", name: "Zamtel" },
        ],
    },
];

export function getCountryByCode(code: string): CountryProvider | undefined {
    return PAWAPAY_COUNTRIES.find((c) => c.code === code)
}

export function getProvidersByCountry(countryCode: string) {
    const country = getCountryByCode(countryCode)
    return country?.providers || []
}
