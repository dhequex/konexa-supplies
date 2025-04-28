"use client"

import { SupplyPickerApp } from "@/components/supply-picker-app"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

function HomeContent() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-[#f8f5f2] text-[#1a365d]">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <img src="/konexa-logo.png" alt="KONEXA Logo" className="h-12 md:h-16" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d] font-poppins">{t("app.title")}</h1>
            <p className="text-lg text-[#6d6d6d] font-inter">{t("app.subtitle")}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <LanguageSwitcher />
          </div>
        </header>
        <SupplyPickerApp />
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}
