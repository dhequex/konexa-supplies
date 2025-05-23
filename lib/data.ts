import type { ProductData } from "./types"

// Fallback data in case CSV fetch fails
export const fallbackProducts: ProductData[] = [
  {
    id: "1",
    productName: "Salsa Torani De Chocolate Y Moca Pura Elaborada 468g",
    originalName: "トラーニ チョコレート モカソース ピュアメイド 468g",
    currentPrice: "¥4,003",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 4003,
    inStock: true,
    sku: "SATO-001",
    category: "flavors",
  },
  {
    id: "2",
    productName: "Torani Salsa De Chocolate Y Mocha 1890ml",
    originalName: "東洋ベバレッジ トラーニ チョコレートモカソース 1890ml",
    currentPrice: "¥6,696",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 6696,
    inStock: true,
    sku: "TOSA-002",
    category: "flavors",
  },
  {
    id: "3",
    productName: "Vaso Frio Tapa Plana 10 Oz (1000 units)",
    originalName: "コールドカップ フラットリッド 10オンス (1000個)",
    currentPrice: "¥16,500",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 16500,
    inStock: true,
    sku: "VAFR-003",
    category: "cups",
  },
  {
    id: "4",
    productName: "Vaso Frio Tapa Domo 10 Oz (1000 units)",
    originalName: "コールドカップ ドームリッド 10オンス (1000個)",
    currentPrice: "¥19,800",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 19800,
    inStock: true,
    sku: "VAFR-004",
    category: "cups",
  },
  {
    id: "5",
    productName: "Tapa Vaso Caliente 12 Oz (1000 units)",
    originalName: "ホットカップリッド 12オンス (1000個)",
    currentPrice: "¥11,880",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 11880,
    inStock: true,
    sku: "TAVA-005",
    category: "cups",
  },
  {
    id: "6",
    productName: "Vaso Caliente Blanco 8 Oz (1000 units)",
    originalName: "ホットカップ ホワイト 8オンス (1000個)",
    currentPrice: "¥21,120",
    cantidades: null,
    total: "¥0",
    notes: null,
    priceValue: 21120,
    inStock: true,
    sku: "VACA-006",
    category: "cups",
  },
]

export const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pedido%20Juan%20Valdez%20%20Supplies%20-%20Osaka%20Expo%202025%20-%20Abril%2011%202025-76ZNTLGgSPrq0mlQ5vtxV4F3Dgsn1A.csv"
