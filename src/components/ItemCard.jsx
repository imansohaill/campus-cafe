import { Link } from 'react-router-dom'
import FoodImage from './FoodImage.jsx'
import { formatPrice } from '../utils/format.js'

export default function ItemCard({
  item,
  isFavourite,
  quantityInCart,
  onToggleFavourite,
  onAdd,
}) {
  const { id, name, category, price, description, available } = item

  return (
    <li>
      <article className={`card${available ? '' : ' card--sold-out'}`}>
        <FoodImage item={item} className="card__art" />

        <div className="card__body">
          <p className="card__category">{category}</p>
          <h3 className="card__name">
            {/* The link's ::after covers the whole card, so the entire card opens the item. */}
            <Link to={`/item/${id}`} className="card__link">
              {name}
            </Link>
          </h3>
          <p className="card__desc">{description}</p>
          {quantityInCart > 0 && <p className="card__in-cart">{quantityInCart} in your cart</p>}
        </div>

        <div className="card__footer">
          <span className="price">{formatPrice(price)}</span>
          <div className="card__actions">
            <button
              type="button"
              className="icon-btn"
              aria-label={`Favourite ${name}`}
              aria-pressed={isFavourite}
              onClick={() => onToggleFavourite(id)}
            >
              <span aria-hidden="true">{isFavourite ? '♥' : '♡'}</span>
            </button>
            <button
              type="button"
              className="btn btn--primary btn--small"
              aria-label={available ? `Add ${name} to cart` : `${name} is sold out`}
              disabled={!available}
              onClick={() => onAdd(item)}
            >
              {available ? 'Add' : 'Sold out'}
            </button>
          </div>
        </div>
      </article>
    </li>
  )
}
