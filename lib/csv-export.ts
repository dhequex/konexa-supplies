import type { ProductData } from "./types"

/**
 * Convert products array to CSV string
 */
export function productsToCSV(products: ProductData[]): string {
  // Define CSV headers
  const headers = ["ID", "Product Name", "Original Name", "Current Price", "Price Value", "SKU", "Category", "Notes"]

  // Create CSV content
  let csvContent = headers.join(",") + "\n"

  // Add product rows
  products.forEach((product) => {
    // Escape fields that might contain commas
    const escapedProductName = `"${product.productName.replace(/"/g, '""')}"`
    const escapedOriginalName = `"${product.originalName.replace(/"/g, '""')}"`
    const escapedNotes = product.notes ? `"${product.notes.replace(/"/g, '""')}"` : ""

    const row = [
      product.id,
      escapedProductName,
      escapedOriginalName,
      product.currentPrice,
      product.priceValue,
      product.sku,
      product.category,
      escapedNotes,
    ]

    csvContent += row.join(",") + "\n"
  })

  return csvContent
}

/**
 * Download products as CSV file
 */
export function downloadProductsCSV(products: ProductData[]): void {
  const csvContent = productsToCSV(products)

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute("href", url)
  link.setAttribute("download", `konexa-products-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  // Add to document, click and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
