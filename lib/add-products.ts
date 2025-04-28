import type { ProductData } from "./types"

/**
 * Generate a SKU from the product name
 */
export function generateSKU(productName: string, index: number): string {
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

/**
 * Add new products to the existing product list
 */
export function addNewProducts(existingProducts: ProductData[]): ProductData[] {
  // Get the highest existing ID to ensure new IDs are unique
  const highestId = Math.max(...existingProducts.map((p) => Number.parseInt(p.id)))

  // New products to add
  const newProducts: Partial<ProductData>[] = [
    {
      productName: "Vaso Frio Tapa Plana 10 Oz (1000 units)",
      originalName: "コールドカップ フラットリッド 10オンス (1000個)",
      currentPrice: "¥16,500",
      priceValue: 16500,
      category: "cups",
    },
    {
      productName: "Vaso Frio Tapa Domo 10 Oz (1000 units)",
      originalName: "コールドカップ ドームリッド 10オンス (1000個)",
      currentPrice: "¥19,800",
      priceValue: 19800,
      category: "cups",
    },
    {
      productName: "Tapa Vaso Caliente 12 Oz (1000 units)",
      originalName: "ホットカップリッド 12オンス (1000個)",
      currentPrice: "¥11,880",
      priceValue: 11880,
      category: "cups",
    },
    {
      productName: "Vaso Caliente Blanco 8 Oz (1000 units)",
      originalName: "ホットカップ ホワイト 8オンス (1000個)",
      currentPrice: "¥21,120",
      priceValue: 21120,
      category: "cups",
    },
  ]

  // Convert partial products to full products with all required fields
  const fullNewProducts: ProductData[] = newProducts.map((product, index) => {
    const id = (highestId + index + 1).toString()
    return {
      id,
      productName: product.productName!,
      originalName: product.originalName!,
      currentPrice: product.currentPrice!,
      priceValue: product.priceValue!,
      cantidades: null,
      total: "¥0",
      notes: null,
      sku: generateSKU(product.productName!, Number.parseInt(id)),
      category: product.category as "cups" | "flavors" | "consumables" | "other",
      inStock: true,
    }
  })

  // Return combined list of existing and new products
  return [...existingProducts, ...fullNewProducts]
}
