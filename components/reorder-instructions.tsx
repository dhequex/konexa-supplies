"use client"

import { useState, useEffect } from "react"
import { MoveVertical } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/i18n/language-context"

export function ReorderInstructions() {
  const { t } = useLanguage()
  const [show, setShow] = useState(true)

  // Hide instructions after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <Alert className="mb-4 bg-konexa-navy/5 border-konexa-navy/20">
      <MoveVertical className="h-4 w-4 text-konexa-navy" />
      <AlertDescription className="font-inter text-konexa-navy">{t("reorderInstructions")}</AlertDescription>
    </Alert>
  )
}
