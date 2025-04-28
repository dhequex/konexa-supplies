export interface PriceMapping {
  productName: string
  originalName: string
  price: number
}

export const productPrices: PriceMapping[] = [
  {
    productName: "Torani Salsa De Chocolate Y Mocha 1890ml",
    originalName: "東洋ベバレッジ トラーニ チョコレートモカソース 1890ml",
    price: 6696,
  },
  {
    productName: "Torani Saborizante Chocolate Puro Hecho Sin Azúcar 750ml",
    originalName: "トラーニ ピュアメイド ゼロシュガー チョコレート 750ml",
    price: 3321,
  },
  {
    productName: "Torani Salsa De Caramelo 1890ml",
    originalName: "東洋ベバレッジ トラーニ キャラメルソース 1890ml",
    price: 7560,
  },
  {
    productName: "Torani Saborizante De Caramelo Torani 750ml",
    originalName: "トラーニ キャラメル 750ml フレーバー シロップ Torani Caramel Syrup 750ml",
    price: 4543,
  },
  {
    productName: "Torani Saborizante Crema Irlandesa 750ml",
    originalName: "トラーニ torani フレーバーシロップ アイリッシュクリーム 750ml 1本 flavored syrop 東洋ベバレッジ",
    price: 3164,
  },
  {
    productName: "Torani Saborizante Cero Azúcar Vainilla 750ml",
    originalName: "トラーニ ピュアメイド シロップ ゼロシュガー バニラ 750ml",
    price: 3264,
  },
  {
    productName: "Prana Chai 1kg",
    originalName: "プラナチャイ 1kG",
    price: 8195,
  },
  {
    productName: "Mita Beverage Sirope Matcha Paquete de Papel 1L",
    originalName: "三田飲料 抹茶ｼﾛｯﾌﾟ 紙ﾊﾟｯｸ 1L",
    price: 1804,
  },
  {
    productName: "Torani Sirope De Canela 750ml Sirope De Sabor Torani Sirope De Canela 750ml",
    originalName: "トラーニ シナモン 750ml フレーバー シロップ Torani Cinnamon Syrup 750ml",
    price: 4543,
  },
  {
    productName: "Bomba dosificadora exclusiva Torani",
    originalName: "トラーニ 専用ディスペンサー ポンプ",
    price: 1323,
  },
  {
    productName:
      "La Perruche Azúcar moreno 2,5 kg (envuelto individualmente) Café francés Azúcar en cubos Café Azúcar La Perruche",
    originalName:
      "［ラ・ペルーシュ］ ブラウンシュガー 2.5kg（個包装） フランス産 コーヒー 角砂糖 カフェシュガー La Perruche",
    price: 9423,
  },
  {
    productName: "Servilletas comerciales de origami de 6 pliegues, forma de montaña, blanco liso, 1000 hojas",
    originalName: "業務用 6つ折り紙ナプキン 山型 白無地 1000枚入",
    price: 1432,
  },
  {
    productName: "Pajitas flexibles, sin embalaje individual, negras, 500 unidades",
    originalName: "フレックス ストロー 個別包装なし ブラック 500本入り",
    price: 1739,
  },
  {
    productName: "President Spray Whip 250g (1 botella)",
    originalName: "プレジデント スプレーホイップ 250g (1本)",
    price: 1349,
  },
  {
    productName: "Salsa Torani De Chocolate Y Moca Pura Elaborada 468g",
    originalName: "トラーニ チョコレート モカソース ピュアメイド 468g",
    price: 4003,
  },
]

// Function to find a price match based on product name or original name
export function findProductPrice(product: { productName: string; originalName: string }): number | null {
  // Try exact match first
  const exactMatch = productPrices.find(
    (p) =>
      p.productName.toLowerCase() === product.productName.toLowerCase() ||
      p.originalName.toLowerCase() === product.originalName.toLowerCase(),
  )

  if (exactMatch) {
    return exactMatch.price
  }

  // Try partial match if exact match fails
  const partialMatch = productPrices.find(
    (p) =>
      product.productName.toLowerCase().includes(p.productName.toLowerCase()) ||
      p.productName.toLowerCase().includes(product.productName.toLowerCase()) ||
      product.originalName.toLowerCase().includes(p.originalName.toLowerCase()) ||
      p.originalName.toLowerCase().includes(product.originalName.toLowerCase()),
  )

  if (partialMatch) {
    return partialMatch.price
  }

  return null
}
