"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProductData } from "@/lib/types"
import { generateOrderPDF } from "@/lib/pdf-generator"
import { PdfViewer } from "@/components/pdf-viewer"
import { useLanguage } from "@/lib/i18n/language-context"

interface PdfDownloadButtonProps {
  cartItems: Array<{ product: ProductData; quantity: number }>
  customerName: string
  customerEmail: string
  companyName: string
  companyAddress: string
  comments: string
  onSuccess?: () => void
  disabled?: boolean
}

export function PdfDownloadButton({
  cartItems,
  customerName,
  customerEmail,
  companyName,
  companyAddress,
  comments,
  onSuccess,
  disabled = false,
}: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const { toast } = useToast()
  const { t, language } = useLanguage()

  const handleDownload = async () => {
    if (disabled || isGenerating) return

    setIsGenerating(true)
    toast({
      title: t("cart.toast.processingTitle"),
      description: t("cart.toast.processingDesc"),
    })

    try {
      // Generate the PDF
      const doc = generateOrderPDF(
        cartItems,
        customerName,
        customerEmail,
        companyName,
        companyAddress,
        comments,
        language,
      )

      // Get PDF as base64 string
      const pdfData = doc.output("datauristring")
      setPdfDataUri(pdfData)

      // Try multiple download methods
      let downloadSuccessful = false

      // Method 1: Direct download with link click
      try {
        const link = document.createElement("a")
        link.href = pdfData
        link.download = `konexa-order-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        downloadSuccessful = true
      } catch (error) {
        console.warn("Method 1 (direct link) failed:", error)
      }

      // Method 2: Blob URL download
      if (!downloadSuccessful) {
        try {
          const blob = doc.output("blob")
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `konexa-order-${new Date().toISOString().split("T")[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          downloadSuccessful = true
        } catch (error) {
          console.warn("Method 2 (blob URL) failed:", error)
        }
      }

      // Method 3: Open in new window
      if (!downloadSuccessful) {
        try {
          const blob = doc.output("blob")
          const url = URL.createObjectURL(blob)
          window.open(url, "_blank")
          URL.revokeObjectURL(url)
          downloadSuccessful = true
        } catch (error) {
          console.warn("Method 3 (new window) failed:", error)
        }
      }

      // If all direct download methods failed, show the PDF viewer
      if (!downloadSuccessful) {
        setShowPdfViewer(true)
        toast({
          title: t("cart.toast.downloadTitle"),
          description: t("cart.toast.downloadDesc"),
        })
      } else {
        toast({
          title: t("cart.toast.successTitle"),
          description: t("cart.toast.successDesc"),
        })
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: t("cart.toast.errorTitle"),
        description: t("cart.toast.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePdfViewerClose = () => {
    setShowPdfViewer(false)
    if (onSuccess) onSuccess()
  }

  return (
    <>
      <Button
        onClick={handleDownload}
        className="w-full bg-konexa-navy hover:bg-konexa-teal flex items-center justify-center gap-2 font-poppins"
        disabled={disabled || isGenerating}
      >
        <FileDown className="h-4 w-4" />
        {isGenerating ? t("cart.form.generating") : t("cart.form.submit")}
      </Button>

      {pdfDataUri && (
        <PdfViewer
          pdfDataUri={pdfDataUri}
          fileName={`konexa-order-${new Date().toISOString().split("T")[0]}.pdf`}
          isOpen={showPdfViewer}
          onClose={handlePdfViewerClose}
        />
      )}
    </>
  )
}
