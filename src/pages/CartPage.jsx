import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Cart from '../components/Cart.jsx'
import { formatPrice } from '../utils/format.js'

export default function CartPage() {
  const { lines, totalCount, totalPrice, maxPerItem, setQuantity, removeItem, clearCart } =
    useCart()
  const [order, setOrder] = useState(null)

  // Demo checkout: there is no backend, so "placing" an order just confirms it and empties the cart.
  function handleCheckout() {
    setOrder({
      number: Math.floor(100 + Math.random() * 900),
      count: totalCount,
      total: totalPrice,
    })
    clearCart()
  }

  if (order) {
    return (
      <div className="status status--success" role="status">
        <p className="status__title">Order #{order.number} placed</p>
        <p>
          {order.count} {order.count === 1 ? 'item' : 'items'} · {formatPrice(order.total)}. We’ll
          call your number when it’s ready at the counter.
        </p>
        <Link to="/" className="btn btn--primary" onClick={() => setOrder(null)}>
          Back to menu
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-head">
        <h1>Your cart</h1>
      </div>

      {lines.length === 0 ? (
        <div className="status">
          <p className="status__title">Your cart is empty</p>
          <p>Pick something tasty from today’s menu.</p>
          <Link to="/" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      ) : (
        <Cart
          lines={lines}
          totalCount={totalCount}
          totalPrice={totalPrice}
          maxPerItem={maxPerItem}
          onChangeQuantity={setQuantity}
          onRemove={removeItem}
          onClear={clearCart}
          onCheckout={handleCheckout}
        />
      )}
    </>
  )
}
