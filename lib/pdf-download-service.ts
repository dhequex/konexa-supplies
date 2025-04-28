import type { ProductData } from "./types"
import { generateOrderPDF } from "./pdf-generator"

/**
 * Service to handle PDF generation and download with multiple fallback methods
 */
export async function downloadOrderPDF(
  cartItems: Array<{ product: ProductData; quantity: number }>,
  customerName: string,
  customerEmail: string,
  companyName: string,
  companyAddress: string,
  comments: string,
  language: string,
): Promise<{ success: boolean; dataUri?: string; error?: string }> {
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
    const pdfDataUri = doc.output("datauristring")

    return {
      success: true,
      dataUri: pdfDataUri,
    }
  } catch (error) {
    console.error("PDF generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error generating PDF",
    }
  }
}
