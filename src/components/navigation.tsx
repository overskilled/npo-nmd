"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Satellite, Globe } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "@/lib/useTranslations";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const t = useTranslations("navigation");

  function changeLanguage(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    window.location.reload(); // Force reload so `request.ts` picks up the new cookie
  }
  const nextLocale = t("language") === "FR" ? "en" : "fr";

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/advisory-board", label: t("advisoryBoard") },
    { href: "/mission-237", label: t("mission237") },
    { href: "/membership", label: t("becomeMember") },
    // { href: "/get-involved", label: t("getInvolved") },
    { href: "/contribute", label: t("contribute") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 relative w-[100px] h-[100px]"
          >
            {" "}
            {/* Set the size of the div here */}
            <Image
              src="/assets/logoWithoutBackground.png"
              alt="NMD Association Logo"
              fill
              className="rounded-2xl object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Toggle & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => changeLanguage(nextLocale)}
            >
              <Globe className="h-4 w-4 mr-1" />
              {t("language")}
            </Button>
            {user ? (
              <Link href="/member-portal">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t("dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/become-member">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t("join")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t("login")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6 text-gray-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-200">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 mb-4"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {t("language") === "EN" ? "FR" : "EN"}
                  </Button>
                  {user ? (
                    <Link href="/member-portal">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        {t("dashboard")}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/membership">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          {t("join")}
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          {t("login")}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
