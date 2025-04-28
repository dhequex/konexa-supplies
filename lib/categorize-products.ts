import type { ProductData } from "./types"

// Keywords for each category
const categoryKeywords = {
  cups: ["cup", "mug", "glass", "tumbler", "vaso", "taza", "カップ", "マグ", "グラス"],
  flavors: [
    "flavor",
    "syrup",
    "sauce",
    "torani",
    "saborizante",
    "sirope",
    "salsa",
    "chai",
    "chocolate",
    "caramel",
    "vanilla",
    "vainilla",
    "canela",
    "cinnamon",
    "mocha",
    "フレーバー",
    "シロップ",
    "ソース",
    "チョコレート",
    "キャラメル",
    "バニラ",
    "シナモン",
    "モカ",
    "チャイ",
  ],
  consumables: [
    "napkin",
    "straw",
    "servilleta",
    "pajita",
    "paper",
    "papel",
    "wrap",
    "ナプキン",
    "ストロー",
    "紙",
    "ラップ",
    "包装",
  ],
}

/**
 * Automatically categorize a product based on its name
 */
export function categorizeProduct(product: ProductData): "cups" | "flavors" | "consumables" | "other" {
  const name = (product.productName + " " + product.originalName).toLowerCase()

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => name.includes(keyword))) {
      return category as "cups" | "flavors" | "consumables"
    }
  }

  return "other"
}

/**
 * Categorize an array of products
 */
export function categorizeProducts(products: ProductData[]): ProductData[] {
  return products.map((product) => ({
    ...product,
    category: categorizeProduct(product),
  }))
}

/**
 * Get the display name for a category
 */
export function getCategoryDisplayName(category: string, language: string): string {
  const translations: Record<string, Record<string, string>> = {
    en: {
      cups: "Cups",
      flavors: "Flavors",
      consumables: "Consumables",
      other: "Other",
    },
    es: {
      cups: "Tazas",
      flavors: "Sabores",
      consumables: "Consumibles",
      other: "Otros",
    },
    ja: {
      cups: "カップ",
      flavors: "フレーバー",
      consumables: "消耗品",
      other: "その他",
    },
  }

  return translations[language]?.[category] || translations.en[category] || category
}

/**
 * Get the color for a category
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case "cups":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "flavors":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "consumables":
      return "bg-amber-100 text-amber-800 border-amber-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
