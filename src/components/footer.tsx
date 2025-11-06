import Link from "next/link";
import { Satellite, Phone, Mail, MapPin, Linkedin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {/* <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Satellite className="h-6 w-6 text-white" />
              </div> */}
              <Image
                src="/assets/logoWhiteOnBlue.png"
                alt="NMD Association Logo"
                width={200}
                height={200}
                className="rounded-2xl object-contain"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              {t("common.footerMessage")}
            </p>
            <p className="text-sm text-gray-500">{t("common.footerDate")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">Liens Rapides</h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t("navigation.about")}
              </Link>
              <Link
                href="/mission-237"
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t("navigation.mission237")}
              </Link>
              <Link
                href="/membership"
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t("navigation.becomeMember")}
              </Link>
              <Link
                href="/contribute"
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t("navigation.contribute")}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>Immeuble Face Agence SCB</p>
                  <p>Carrefour Express</p>
                  <p>Cité des Palmiers, Douala</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a
                  href="tel:+237691341013"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  +237 691 341 013
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a
                  href="mailto:contact@npo.nanosatellitemissions.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  contact@npo.nanosatellitemissions.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Linkedin className="h-5 w-5 text-blue-400" />
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  NMD Foundation
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 NMD ASSOCIATION. {t("common.copyright")} |
            <a
              href="https://npo.nanosatellitemissions.com"
              className="hover:text-blue-400 transition-colors ml-1"
            >
              npo.nanosatellitemissions.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
