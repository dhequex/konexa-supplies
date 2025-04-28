"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/language-context"
import { getCategoryDisplayName } from "@/lib/categorize-products"

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  availabilityFilter: "all" | "in-stock" | "out-of-stock"
  setAvailabilityFilter: (filter: "all" | "in-stock" | "out-of-stock") => void
  sortOrder: "name-asc" | "name-desc" | "price-asc" | "price-desc"
  setSortOrder: (order: "name-asc" | "name-desc" | "price-asc" | "price-desc") => void
  categoryFilter: "all" | "cups" | "flavors" | "consumables" | "other"
  setCategoryFilter: (category: "all" | "cups" | "flavors" | "consumables" | "other") => void
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  availabilityFilter,
  setAvailabilityFilter,
  sortOrder,
  setSortOrder,
  categoryFilter,
  setCategoryFilter,
}: SearchBarProps) {
  const { t, language } = useLanguage()

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-1 block font-poppins text-konexa-navy">
            {t("search.title")}
          </Label>
          <Input
            id="search"
            placeholder={t("search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-inter"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-medium mb-1 block font-poppins text-konexa-navy">
            {t("search.category")}
          </Label>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
            <SelectTrigger id="category" className="w-full font-inter">
              <SelectValue placeholder={t("search.category")} />
            </SelectTrigger>
            <SelectContent className="font-inter">
              <SelectItem value="all">{t("search.categoryOptions.all")}</SelectItem>
              <SelectItem value="cups">{getCategoryDisplayName("cups", language)}</SelectItem>
              <SelectItem value="flavors">{getCategoryDisplayName("flavors", language)}</SelectItem>
              <SelectItem value="consumables">{getCategoryDisplayName("consumables", language)}</SelectItem>
              <SelectItem value="other">{getCategoryDisplayName("other", language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort" className="text-sm font-medium mb-1 block font-poppins text-konexa-navy">
            {t("search.sortBy")}
          </Label>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
            <SelectTrigger id="sort" className="w-full font-inter">
              <SelectValue placeholder={t("search.sortBy")} />
            </SelectTrigger>
            <SelectContent className="font-inter">
              <SelectItem value="name-asc">{t("search.sortOptions.nameAsc")}</SelectItem>
              <SelectItem value="name-desc">{t("search.sortOptions.nameDesc")}</SelectItem>
              <SelectItem value="price-asc">{t("search.sortOptions.priceAsc")}</SelectItem>
              <SelectItem value="price-desc">{t("search.sortOptions.priceDesc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="availability" className="text-sm font-medium mb-1 block font-poppins text-konexa-navy">
            {t("search.availability")}
          </Label>
          <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value as any)}>
            <SelectTrigger id="availability" className="w-full font-inter">
              <SelectValue placeholder={t("search.availability")} />
            </SelectTrigger>
            <SelectContent className="font-inter">
              <SelectItem value="all">{t("search.availabilityOptions.all")}</SelectItem>
              <SelectItem value="in-stock">{t("search.availabilityOptions.inStock")}</SelectItem>
              <SelectItem value="out-of-stock">{t("search.availabilityOptions.outOfStock")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
