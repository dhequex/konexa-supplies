"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Plus, Minus } from "lucide-react"
import type { ProductData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

interface ProductCardProps {
  product: ProductData
  addToCart: (product: ProductData, quantity: number) => void
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { t } = useLanguage()

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1) // Reset after adding
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="md:col-span-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-konexa-teal flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold font-poppins text-konexa-navy">{product.productName}</h3>
                <p className="text-sm text-gray-600 font-inter">{product.originalName}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="font-inter">
                    {product.currentPrice}
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
