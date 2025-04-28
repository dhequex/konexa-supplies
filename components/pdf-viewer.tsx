"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/hooks/use-toast"

interface PdfViewerProps {
  pdfDataUri: string
  fileName: string
  isOpen: boolean
  onClose: () => void
}

export function PdfViewer({ pdfDataUri, fileName, isOpen, onClose }: PdfViewerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [viewerType, setViewerType] = useState<"iframe" | "object" | "embed" | "external">("iframe")
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)

    // Determine the best viewer type based on browser support
    const testIframe = document.createElement("iframe")
    if (testIframe.contentWindow && "navigator" in testIframe.contentWindow) {
      setViewerType("iframe")
    } else {
      const testObject = document.createElement("object")
      if (testObject.contentDocument) {
        setViewerType("object")
      } else {
        setViewerType("embed")
      }
    }
  }, [])

  if (!isMounted) return null

  const handleDownload = () => {
    try {
      // Try multiple download methods
      let downloadSuccessful = false

      // Method 1: Direct download with link click
      try {
        const link = document.createElement("a")
        link.href = pdfDataUri
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        downloadSuccessful = true
      } catch (error) {
        console.warn("Method 1 (direct link) failed:", error)
      }

      // Method 2: Open in new tab
      if (!downloadSuccessful) {
        window.open(pdfDataUri, "_blank")
        downloadSuccessful = true
      }

      if (downloadSuccessful) {
        toast({
          title: t("pdf.downloadStarted"),
          description: t("pdf.downloadStartedDesc"),
        })
      } else {
        toast({
          title: t("pdf.downloadFailed"),
          description: t("pdf.downloadFailedDesc"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: t("pdf.downloadFailed"),
        description: t("pdf.downloadFailedDesc"),
        variant: "destructive",
      })
    }
  }

  const handleOpenExternal = () => {
    window.open(pdfDataUri, "_blank")
  }

  const renderPdfViewer = () => {
    switch (viewerType) {
      case "iframe":
        return <iframe src={pdfDataUri} className="w-full h-full border-0" />
      case "object":
        return (
          <object data={pdfDataUri} type="application/pdf" className="w-full h-full">
            <p>{t("pdf.cantDisplay")}</p>
          </object>
        )
      case "embed":
        return <embed src={pdfDataUri} type="application/pdf" className="w-full h-full" />
      case "external":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="mb-4 text-center">{t("pdf.useExternalViewer")}</p>
            <Button onClick={handleOpenExternal} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              {t("pdf.openInNewTab")}
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-poppins text-konexa-navy">{t("pdf.title")}</DialogTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              className="bg-konexa-navy hover:bg-konexa-teal flex items-center gap-2 font-poppins"
            >
              <Download className="h-4 w-4" />
              {t("pdf.download")}
            </Button>
            <Button onClick={handleOpenExternal} variant="outline" className="flex items-center gap-2 font-poppins">
              <ExternalLink className="h-4 w-4" />
              {t("pdf.openInNewTab")}
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 w-full h-full min-h-[60vh]">{renderPdfViewer()}</div>
      </DialogContent>
    </Dialog>
  )
}
