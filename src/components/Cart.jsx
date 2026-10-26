import { Link } from 'react-router-dom'
import FoodImage from './FoodImage.jsx'
import QuantityControl from './QuantityControl.jsx'
import { formatPrice } from '../utils/format.js'

export default function Cart({
  lines,
  totalCount,
  totalPrice,
  maxPerItem,
  onChangeQuantity,
  onRemove,
  onClear,
  onCheckout,
}) {
  return (
    <div className="cart-layout">
      <section aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading" className="visually-hidden">
          Items in your cart
        </h2>
        <ul className="cart-lines">
          {lines.map((line) => (
            <li key={line.id} className="cart-line">
              <FoodImage item={line} className="cart-line__art" />
              <div className="cart-line__info">
                <Link to={`/item/${line.id}`} className="cart-line__name">
                  {line.name}
                </Link>
                <span className="cart-line__unit">{formatPrice(line.price)} each</span>
              </div>
              <span className="cart-line__total">{formatPrice(line.price * line.quantity)}</span>
              <div className="cart-line__qty">
                <QuantityControl
                  name={line.name}
                  value={line.quantity}
                  max={maxPerItem}
                  onChange={(next) => onChangeQuantity(line.id, next)}
                />
              </div>
              <button
                type="button"
                className="link-btn cart-line__remove"
                aria-label={`Remove ${line.name} from cart`}
                onClick={() => onRemove(line.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="summary" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="summary__title">
          Order summary
        </h2>
        <dl className="summary__rows">
          <div>
            <dt>Items</dt>
            <dd data-testid="cart-items-count">{totalCount}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd data-testid="cart-total">{formatPrice(totalPrice)}</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--primary btn--block" onClick={onCheckout}>
          Place order
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onClear}>
          Clear cart
        </button>
      </aside>
    </div>
  )
}
