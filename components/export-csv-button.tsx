"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { downloadProductsCSV } from "@/lib/csv-export"
import type { ProductData } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/hooks/use-toast"

interface ExportCSVButtonProps {
  products: ProductData[]
}

export function ExportCSVButton({ products }: ExportCSVButtonProps) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleExport = () => {
    try {
      downloadProductsCSV(products)
      toast({
        title: t("export.successTitle"),
        description: t("export.successDesc"),
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: t("export.errorTitle"),
        description: t("export.errorDesc"),
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2 bg-white border-konexa-navy text-konexa-navy hover:bg-konexa-navy hover:text-white"
    >
      <FileDown className="h-4 w-4" />
      {t("export.button")}
    </Button>
  )
}
