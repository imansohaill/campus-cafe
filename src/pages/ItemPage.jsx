import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMenu } from '../context/MenuContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import FoodImage from '../components/FoodImage.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import { ErrorMessage, LoadingMessage } from '../components/Status.jsx'
import { formatPrice } from '../utils/format.js'

function ItemDetails({ item }) {
  const { addItem, quantityById, maxPerItem } = useCart()
  const { favourites, toggleFavourite } = useFavourites()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(null)

  const isFavourite = favourites.includes(item.id)
  const inCart = quantityById[item.id] ?? 0

  function handleAdd() {
    addItem(item, quantity)
    setJustAdded(quantity)
    setQuantity(1)
  }

  return (
    <article className="details">
      <FoodImage item={item} className="details__art" />

      <div className="details__body">
        <p className="card__category">{item.category}</p>
        <h1 className="details__name">{item.name}</h1>
        <p className="details__price">{formatPrice(item.price)}</p>
        <p className="details__desc">{item.description}</p>

        <ul className="meta" aria-label="Details">
          <li>{item.calories} kcal</li>
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
          <li className={item.available ? 'meta__ok' : 'meta__out'}>
            {item.available ? 'Available today' : 'Sold out today'}
          </li>
        </ul>

        {item.available && (
          <div className="details__buy">
            <QuantityControl
              name={item.name}
              value={quantity}
              max={maxPerItem}
              onChange={setQuantity}
            />
            <button type="button" className="btn btn--primary" onClick={handleAdd}>
              Add to cart · {formatPrice(item.price * quantity)}
            </button>
          </div>
        )}

        <button
          type="button"
          className="btn btn--ghost"
          aria-pressed={isFavourite}
          onClick={() => toggleFavourite(item.id)}
        >
          <span aria-hidden="true">{isFavourite ? '♥' : '♡'}</span>{' '}
          {isFavourite ? 'Saved to favourites' : 'Save to favourites'}
        </button>

        <div className="details__feedback" role="status">
          {justAdded !== null && (
            <p>
              Added {justAdded} × {item.name} to your cart.{' '}
              <Link to="/cart">View cart</Link>
            </p>
          )}
          {justAdded === null && inCart > 0 && <p>{inCart} already in your cart.</p>}
        </div>
      </div>
    </article>
  )
}

export default function ItemPage() {
  const { id } = useParams()
  const { status, error, getItem, reload } = useMenu()
  const item = getItem(id)

  return (
    <>
      <p className="back">
        <Link to="/">← Back to menu</Link>
      </p>

      {status === 'loading' && <LoadingMessage>Loading dish…</LoadingMessage>}
      {status === 'error' && <ErrorMessage message={error} onRetry={reload} />}
      {status === 'success' && !item && (
        <div className="status">
          <p className="status__title">We couldn’t find that dish</p>
          <p>It may not be on today’s menu.</p>
          <Link to="/" className="btn btn--primary">
            See today’s menu
          </Link>
        </div>
      )}
      {status === 'success' && item && <ItemDetails key={item.id} item={item} />}
    </>
  )
}
