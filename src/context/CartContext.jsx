import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'canteen.cart.v1'
const MAX_PER_ITEM = 20

function loadLines() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        typeof line?.id === 'string' &&
        typeof line.name === 'string' &&
        Number.isFinite(line.price) &&
        Number.isInteger(line.quantity) &&
        line.quantity >= 1,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // Each line is a snapshot: { id, name, price, emoji, quantity }.
  const [lines, setLines] = useState(loadLines)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [lines])

  const addItem = useCallback((item, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.id === item.id)
      if (existing) {
        return prev.map((line) =>
          line.id === item.id
            ? { ...line, quantity: Math.min(MAX_PER_ITEM, line.quantity + quantity) }
            : line,
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          emoji: item.emoji,
          image: item.image,
          quantity: Math.min(MAX_PER_ITEM, quantity),
        },
      ]
    })
  }, [])

  const setQuantity = useCallback((id, quantity) => {
    const clamped = Math.min(MAX_PER_ITEM, Math.max(1, quantity))
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, quantity: clamped } : line)))
  }, [])

  const removeItem = useCallback((id) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const totalCount = lines.reduce((sum, line) => sum + line.quantity, 0)
    const totalPrice = lines.reduce((sum, line) => sum + line.quantity * line.price, 0)
    const quantityById = Object.fromEntries(lines.map((line) => [line.id, line.quantity]))
    return {
      lines,
      totalCount,
      totalPrice,
      quantityById,
      maxPerItem: MAX_PER_ITEM,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }
  }, [lines, addItem, setQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
