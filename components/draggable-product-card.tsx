"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, GripVertical } from "lucide-react"
import type { ProductData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"
import { useDrag, useDrop } from "react-dnd"
import type { Identifier } from "dnd-core"
import { getCategoryDisplayName, getCategoryColor } from "@/lib/categorize-products"

interface ProductCardProps {
  product: ProductData
  addToCart: (product: ProductData, quantity: number) => void
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
  id: string
}

interface DragItem {
  index: number
  id: string
  type: string
}

export function DraggableProductCard({ product, addToCart, index, moveItem, id }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { t, language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1) // Reset after adding
  }

  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT_CARD",
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "PRODUCT_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  // Get category display name and color
  const categoryName = getCategoryDisplayName(product.category, language)
  const categoryColorClass = getCategoryColor(product.category)

  return (
    <Card
      className={`overflow-hidden border-0 shadow-md transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
      ref={ref}
      data-handler-id={handlerId}
    >
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="md:col-span-3">
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mr-2">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold font-poppins text-konexa-navy">{product.productName}</h3>
                  <Badge className={`${categoryColorClass} font-inter`}>{categoryName}</Badge>
                </div>
                <p className="text-sm text-gray-600 font-inter">{product.originalName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="font-inter">
                    {product.currentPrice}
                  </Badge>
                  <Badge variant="outline" className="font-inter bg-gray-100">
                    {product.sku}
                  </Badge>
                </div>
                {product.notes && <p className="text-sm text-gray-500 mt-2 font-inter">{product.notes}</p>}
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col justify-center space-y-3">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8 rounded-r-none">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="h-8 w-16 text-center rounded-none font-inter"
              />
              <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8 rounded-l-none">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} className="w-full bg-konexa-navy hover:bg-konexa-teal font-poppins">
              {t("product.addToOrder")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
