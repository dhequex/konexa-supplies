"use client"

import { useState, useCallback, useEffect } from "react"
import type { ProductData } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/language-context"
import { DraggableProductCard } from "./draggable-product-card"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ReorderInstructions } from "./reorder-instructions"

interface ProductListProps {
  products: ProductData[]
  addToCart: (product: ProductData, quantity: number) => void
}

export function ProductList({ products, addToCart }: ProductListProps) {
  const { t } = useLanguage()
  const [items, setItems] = useState<ProductData[]>([])

  // Update items when products change from parent
  useEffect(() => {
    setItems(products)
  }, [products])

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const dragItem = newItems[dragIndex]
      newItems.splice(dragIndex, 1)
      newItems.splice(hoverIndex, 0, dragItem)
      return newItems
    })
  }, [])

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-500 font-inter">{t("noProducts")}</p>
      </div>
    )
  }

  return (
    <>
      <ReorderInstructions />
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-4">
          {items.map((product, index) => (
            <DraggableProductCard
              key={product.id}
              id={product.id}
              product={product}
              addToCart={addToCart}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </div>
      </DndProvider>
    </>
  )
}
