"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { ProductData } from "@/lib/types"
import { Trash2, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { PdfDownloadButton } from "@/components/pdf-download-button"
import { useLanguage } from "@/lib/i18n/language-context"

interface CartPanelProps {
  cart: Map<string, { product: ProductData; quantity: number }>
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
}

export function CartPanel({ cart, updateQuantity, removeFromCart }: CartPanelProps) {
  // Add company name and address to the state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useLanguage()

  const cartItems = Array.from(cart.values())
  const isEmpty = cartItems.length === 0

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.priceValue || 0) * item.quantity
    }, 0)
  }

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEmpty) {
      toast({
        title: t("cart.toast.emptyTitle"),
        description: t("cart.toast.emptyDesc"),
        variant: "destructive",
      })
      return
    }

    if (!name || !email) {
      toast({
        title: t("cart.toast.missingInfoTitle"),
        description: t("cart.toast.missingInfoDesc"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    // The actual PDF generation and download is handled by the PdfDownloadButton component
  }

  // Update the resetForm function to clear the new fields
  const resetForm = () => {
    setName("")
    setEmail("")
    setCompanyName("")
    setCompanyAddress("")
    setComments("")
    setIsSubmitting(false)
    // Optionally clear the cart here if needed
  }

  return (
    <Card className="border-0 shadow-md sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-konexa-navy font-poppins">{t("cart.title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEmpty ? (
          <p className="text-gray-500 text-center py-4 font-inter">{t("cart.empty")}</p>
        ) : (
          <div className="space-y-3">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium font-poppins text-konexa-navy">{product.productName}</h4>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-r-none"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value)
                        if (!isNaN(val) && val > 0) {
                          updateQuantity(product.id, val)
                        }
                      }}
                      className="h-6 w-12 text-center rounded-none text-xs font-inter"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-l-none"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(product.id)}
                      className="h-6 w-6 ml-1"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium font-inter">{formatPrice(product.priceValue * quantity)}</div>
                  <div className="text-sm text-gray-500 font-inter">
                    {product.currentPrice} × {quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span className="font-poppins text-konexa-navy">{t("cart.total")}</span>
          <span className="font-poppins text-konexa-navy">{formatPrice(calculateTotal())}</span>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Input
              placeholder={t("cart.form.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="font-inter"
            />
          </div>

          {/* Add the new form fields after the email input */}
          <div>
            <Input
              type="email"
              placeholder={t("cart.form.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-inter"
            />
          </div>

          <div>
            <Input
              placeholder={t("cart.form.companyName")}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="font-inter"
            />
          </div>

          <div>
            <Input
              placeholder={t("cart.form.companyAddress")}
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="font-inter"
            />
          </div>

          <div>
            <Textarea
              placeholder={t("cart.form.comments")}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="font-inter"
            />
          </div>

          {/* Update the PdfDownloadButton to include the new fields */}
          <PdfDownloadButton
            cartItems={cartItems}
            customerName={name}
            customerEmail={email}
            companyName={companyName}
            companyAddress={companyAddress}
            comments={comments}
            onSuccess={resetForm}
            disabled={isEmpty || !name || !email || isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  )
}
