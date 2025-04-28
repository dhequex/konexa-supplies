import jsPDF from "jspdf"
import "jspdf-autotable"
import type { ProductData } from "./types"
import { getCategoryDisplayName } from "./categorize-products"

// Extend the jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface OrderItem {
  product: ProductData
  quantity: number
}

export function generateOrderPDF(
  orderItems: OrderItem[],
  customerName: string,
  customerEmail: string,
  companyName: string,
  companyAddress: string,
  comments: string,
  language = "en",
): jsPDF {
  try {
    // Create a new PDF document with specific settings for better browser compatibility
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      putOnlyUsedFonts: true, // Only include used fonts to reduce file size
      floatPrecision: 16, // Higher precision for better rendering
    })

    // KONEXA brand colors
    const konexaNavy = [26, 54, 93] // #1a365d in RGB
    const konexaTeal = [0, 128, 128] // #008080 in RGB

    // Get translations based on language
    const translations = getPdfTranslations(language)

    // Add title
    doc.setFontSize(20)
    doc.setTextColor(konexaNavy[0], konexaNavy[1], konexaNavy[2])
    doc.text(translations.orderTitle, 105, 15, { align: "center" })

    // Add order number and date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`${translations.date}: ${new Date().toLocaleDateString(getLocale(language))}`, 195, 15, { align: "right" })

    // Add customer info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`${translations.customer}: ${customerName}`, 14, 30)
    doc.text(`${translations.email}: ${customerEmail}`, 14, 37)

    // Add company info if provided
    let yPosition = 44
    if (companyName) {
      doc.text(`${translations.companyName}: ${companyName}`, 14, yPosition)
      yPosition += 7
    }

    if (companyAddress) {
      doc.text(`${translations.companyAddress}: ${companyAddress}`, 14, yPosition)
      yPosition += 7
    }

    // Add comments if provided
    if (comments) {
      doc.text(`${translations.comments}:`, 14, yPosition)
      doc.setFontSize(10)
      const splitComments = doc.splitTextToSize(comments, 180)
      doc.text(splitComments, 14, yPosition + 7)
      yPosition += 7 + splitComments.length * 5
    }

    // Calculate total
    const total = orderItems.reduce((sum, item) => {
      return sum + item.product.priceValue * item.quantity
    }, 0)

    // Prepare table data
    const tableColumn = [
      translations.table.number,
      translations.table.sku,
      translations.table.product,
      translations.table.category,
      translations.table.unitPrice,
      translations.table.quantity,
      translations.table.total,
    ]
    const tableRows = orderItems.map((item, index) => [
      index + 1,
      item.product.sku,
      item.product.productName,
      getCategoryDisplayName(item.product.category, language),
      item.product.currentPrice,
      item.quantity,
      `¥${(item.product.priceValue * item.quantity).toLocaleString()}`,
    ])

    // Add table - adjust startY based on the content above
    const startY = Math.max(70, yPosition + 5)
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      theme: "grid",
      headStyles: {
        fillColor: konexaNavy, // KONEXA navy blue
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      didDrawPage: (data) => {
        // Footer with page number
        doc.setFontSize(10)
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10,
        )
      },
      // Improve table rendering
      styles: {
        overflow: "linebreak",
        cellWidth: "auto",
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Number column
        1: { cellWidth: 25 }, // SKU column
        2: { cellWidth: "auto" }, // Product name column
        3: { cellWidth: 25 }, // Category column
        4: { cellWidth: 25 }, // Unit price column
        5: { cellWidth: 20 }, // Quantity column
        6: { cellWidth: 25 }, // Total column
      },
    })

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.setFont(undefined, "bold")
    doc.setTextColor(konexaNavy[0], konexaNavy[1], konexaNavy[2])
    doc.text(`${translations.table.total}: ¥${total.toLocaleString()}`, 195, finalY, { align: "right" })

    // Add footer
    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("KONEXA - Expo Osaka 2025", 105, doc.internal.pageSize.height - 10, { align: "center" })

    return doc
  } catch (error) {
    console.error("Error in PDF generation:", error)
    throw error
  }
}

// Update the translations to include the new fields
function getPdfTranslations(language: string) {
  switch (language) {
    case "es":
      return {
        orderTitle: "Pedido de Suministros KONEXA",
        orderNumber: "Número de Pedido",
        date: "Fecha",
        customer: "Cliente",
        email: "Correo Electrónico",
        companyName: "Nombre de la Empresa",
        companyAddress: "Dirección de la Empresa",
        comments: "Comentarios",
        table: {
          number: "#",
          sku: "SKU",
          product: "Producto",
          category: "Categoría",
          unitPrice: "Precio Unitario",
          quantity: "Cantidad",
          total: "Total",
        },
      }
    case "ja":
      return {
        orderTitle: "KONEXA 供給注文",
        orderNumber: "注文番号",
        date: "日付",
        customer: "お客様",
        email: "メール",
        companyName: "会社名",
        companyAddress: "会社住所",
        comments: "コメント",
        table: {
          number: "#",
          sku: "SKU",
          product: "製品",
          category: "カテゴリー",
          unitPrice: "単価",
          quantity: "数量",
          total: "合計",
        },
      }
    default: // English
      return {
        orderTitle: "KONEXA Supply Order",
        orderNumber: "Order Number",
        date: "Date",
        customer: "Customer",
        email: "Email",
        companyName: "Company Name",
        companyAddress: "Company Address",
        comments: "Comments",
        table: {
          number: "#",
          sku: "SKU",
          product: "Product",
          category: "Category",
          unitPrice: "Unit Price",
          quantity: "Quantity",
          total: "Total",
        },
      }
  }
}

// Helper function to get locale for date formatting
function getLocale(language: string): string {
  switch (language) {
    case "es":
      return "es-ES"
    case "ja":
      return "ja-JP"
    default:
      return "en-US"
  }
}
