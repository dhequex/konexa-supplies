"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import enTranslations from "./en.json"
import esTranslations from "./es.json"
import jaTranslations from "./ja.json"

type Language = "en" | "es" | "ja"

type Translations = typeof enTranslations

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
  ja: jaTranslations,
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && ["en", "es", "ja"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".")
    let result: any = translations[language]

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    return result
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
