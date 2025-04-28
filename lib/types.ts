export interface ProductData {
  id: string
  productName: string
  originalName: string
  currentPrice: string
  cantidades: number | null
  total: string
  notes: string | null
  sku: string // Added SKU field
  category: "cups" | "flavors" | "consumables" | "other" // Added category field

  // Derived fields for internal use
  priceValue: number
  inStock: boolean
}
