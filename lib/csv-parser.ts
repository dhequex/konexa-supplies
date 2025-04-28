import type { ProductData } from "./types"
import { categorizeProduct } from "./categorize-products"

export async function fetchAndParseCSV(url: string): Promise<ProductData[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    return []
  }
}

function parseCSV(csvText: string): ProductData[] {
  const lines = csvText.split("\n")

  // Check if we have at least two lines (header + data)
  if (lines.length < 2) {
    console.error("CSV file does not contain enough data")
    return []
  }

  // Get headers from the first line
  const headers = lines[0].split(",").map((header) => header.trim())

  // Process data lines (skip header)
  const products = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const values = parseCSVLine(line)

      // Skip lines that don't have enough values
      if (values.length < 3) {
        console.warn(`Line ${index + 2} doesn't have enough values:`, line)
        return null
      }

      const product: any = { id: (index + 1).toString() }

      // Ensure we have default values for all fields
      product.productName = ""
      product.originalName = ""
      product.currentPrice = "¥0"
      product.priceValue = 0
      product.cantidades = null
      product.total = "¥0"
      product.notes = null
      product.inStock = true
      product.category = "other" // Default category

      // Map CSV values to product properties
      headers.forEach((header, i) => {
        if (i < values.length) {
          const value = values[i].trim()

          switch (header) {
            case "Product Name":
              product.productName = value || ""
              break
            case "Original Name":
              product.originalName = value || ""
              break
            case "Current Price":
              product.currentPrice = value || "¥0"
              // Extract numeric value from price string (remove ¥ and commas)
              product.priceValue = value ? Number.parseFloat(value.replace(/[¥,]/g, "")) : 0
              break
            case "Cantidades":
              product.cantidades = value ? Number.parseInt(value) : null
              break
            case "Total":
              product.total = value || "¥0"
              break
            case "Notes":
              product.notes = value || null
              break
          }
        }
      })

      // Return null for products without a name
      if (!product.productName || product.productName.trim() === "") {
        return null
      }

      // Generate SKU based on product name
      product.sku = generateSKU(product.productName, index + 1)

      // Categorize the product
      product.category = categorizeProduct(product)

      return product
    })
    .filter((product): product is ProductData => product !== null)

  return products
}

// Helper function to handle CSV line parsing with quotes
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

// Generate a SKU from the product name
function generateSKU(productName: string, index: number): string {
  // Extract first letters of main words and add index for uniqueness
  const words = productName.split(/\s+/)
  let sku = ""

  // Take first 3 words max
  const wordsToUse = words.slice(0, 3)

  // Extract first 2 letters from each word
  wordsToUse.forEach((word) => {
    if (word.length > 0) {
      sku += word.substring(0, Math.min(2, word.length)).toUpperCase()
    }
  })

  // Add index with padding for uniqueness
  sku += "-" + String(index).padStart(3, "0")

  return sku
}
