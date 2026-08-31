import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatPrice } from './format'
import type { CartLine, Product } from './types'

const CART_KEY = 'mundoCarton.cart'

interface StoredLine {
  product: Product
  quantity: number
}

function readCart(): StoredLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as StoredLine[]) : []
  } catch {
    return []
  }
}

export interface CartState {
  lines: CartLine[]
  count: number
  total: number
  add: (product: Product) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  whatsappUrl: (phone: string) => string
}

export function useCart(): CartState {
  const [lines, setLines] = useState<CartLine[]>(() => readCart())

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines))
  }, [lines])

  const add = useCallback((product: Product) => {
    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      if (!existing) return [...current, { product, quantity: 1 }]
      return current.map((line) =>
        line.product.id === product.id
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      )
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.product.id !== productId)
        : current.map((line) =>
            line.product.id === productId ? { ...line, quantity } : line,
          ),
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((current) =>
      current.filter((line) => line.product.id !== productId),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const total = useMemo(
    () =>
      lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [lines],
  )

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const whatsappUrl = useCallback(
    (phone: string) => {
      const detail = lines
        .map(
          (line) =>
            `• ${line.quantity} x ${line.product.name} — ${formatPrice(
              line.product.price * line.quantity,
            )}`,
        )
        .join('\n')
      const text = [
        '¡Hola Mundo Cartón! Quiero encargar:',
        detail,
        `Total: ${formatPrice(total)}`,
      ].join('\n')
      return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    },
    [lines, total],
  )

  return { lines, count, total, add, setQuantity, remove, clear, whatsappUrl }
}
