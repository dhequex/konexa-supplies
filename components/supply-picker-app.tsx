"use client"

import { useState, useEffect } from "react"
import { ProductList } from "@/components/product-list"
import { CartPanel } from "@/components/cart-panel"
import { SearchBar } from "@/components/search-bar"
import type { ProductData } from "@/lib/types"
import { fallbackProducts, CSV_URL } from "@/lib/data"
import { fetchAndParseCSV } from "@/lib/csv-parser"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { ExportCSVButton } from "@/components/export-csv-button"
import { addNewProducts } from "@/lib/add-products"

export function SupplyPickerApp() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([])
  const [cart, setCart] = useState<Map<string, { product: ProductData; quantity: number }>>(new Map())
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock" | "out-of-stock">("all")
  const [sortOrder, setSortOrder] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc">("name-asc")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "cups" | "flavors" | "consumables" | "other">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const [orderedProductIds, setOrderedProductIds] = useState<string[]>([])

  // Fetch CSV data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const csvData = await fetchAndParseCSV(CSV_URL)

        // Filter out any products with empty names that might have slipped through
        const validProducts = csvData.filter((product) => product.productName && product.productName.trim() !== "")

        if (validProducts.length > 0) {
          console.log(`Loaded ${validProducts.length} valid products from CSV`)

          // Add the new cup products
          const productsWithNewItems = addNewProducts(validProducts)
          setProducts(productsWithNewItems)
        } else {
          console.warn("No valid products found in CSV, using fallback data")
          // Add new products to fallback data as well
          const fallbackWithNewItems = addNewProducts(fallbackProducts)
          setProducts(fallbackWithNewItems)
          setError("Could not load product data from CSV. Using fallback data.")
        }
      } catch (err) {
        console.error("Failed to load CSV data:", err)
        // Add new products to fallback data
        const fallbackWithNewItems = addNewProducts(fallbackProducts)
        setProducts(fallbackWithNewItems)
        setError("Failed to load product data. Using fallback data.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle search and filtering
  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.productName.toLowerCase().includes(lowercasedSearch) ||
          product.originalName.toLowerCase().includes(lowercasedSearch),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter)
    }

    // Apply availability filter - all products are in stock in this version
    if (availabilityFilter === "out-of-stock") {
      result = []
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.productName.localeCompare(b.productName)
        case "name-desc":
          return b.productName.localeCompare(a.productName)
        case "price-asc":
          return a.priceValue - b.priceValue
        case "price-desc":
          return b.priceValue - a.priceValue
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, searchTerm, availabilityFilter, sortOrder, categoryFilter])

  // Initialize or update ordered products when filtered products change
  useEffect(() => {
    if (filteredProducts.length > 0) {
      // Only update if we don't already have these products in our order
      const currentIds = new Set(orderedProductIds)
      const filteredIds = filteredProducts.map((p) => p.id)

      // Check if we need to update the order
      const needsUpdate =
        filteredIds.some((id) => !currentIds.has(id)) || orderedProductIds.some((id) => !filteredIds.includes(id))

      if (needsUpdate) {
        setOrderedProductIds(filteredIds)
      }
    }
  }, [filteredProducts])

  // Add to cart function
  const addToCart = (product: ProductData, quantity: number) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart)
      const existingItem = newCart.get(product.id)

      if (existingItem) {
        newCart.set(product.id, {
          product,
          quantity: existingItem.quantity + quantity,
        })
      } else {
        newCart.set(product.id, { product, quantity })
      }

      return newCart
    })
  }

  // Update quantity in cart
  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart)
      const item = newCart.get(productId)

      if (item) {
        if (quantity <= 0) {
          newCart.delete(productId)
        } else {
          newCart.set(productId, {
            ...item,
            quantity,
          })
        }
      }

      return newCart
    })
  }

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart)
      newCart.delete(productId)
      return newCart
    })
  }

  // Handle product reordering
  const handleProductReorder = (reorderedProducts: ProductData[]) => {
    setOrderedProductIds(reorderedProducts.map((p) => p.id))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-konexa-teal" />
        <span className="ml-2 text-lg font-poppins text-konexa-navy">Loading products...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-poppins">Error</AlertTitle>
            <AlertDescription className="font-inter">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-konexa-navy font-poppins">
            {filteredProducts.length} {t("search.availabilityOptions.all")}
          </h2>
          <ExportCSVButton products={products} />
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-lg text-gray-500 font-inter">{t("noProducts")}</p>
          </div>
        ) : (
          <ProductList products={filteredProducts} addToCart={addToCart} />
        )}
      </div>
      <div className="lg:col-span-1">
        <CartPanel cart={cart} updateQuantity={updateCartQuantity} removeFromCart={removeFromCart} />
      </div>
    </div>
  )
}
