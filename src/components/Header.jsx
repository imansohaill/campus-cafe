import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

// Lives in Layout, so it is on every screen. The count comes straight from CartContext:
// adding an item anywhere re-renders this badge, no reload needed.
export default function Header() {
  const { totalCount } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true" /> Campus Canteen
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            <li>
              <NavLink to="/" end className="nav__link">
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cart"
                className="nav__link nav__link--cart"
                aria-label={`Cart, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
              >
                <svg className="nav__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
                <span className="nav__cart-label" aria-hidden="true">
                  Cart
                </span>
                <span
                  className={`badge${totalCount === 0 ? ' badge--empty' : ''}`}
                  data-testid="cart-count"
                  aria-hidden="true"
                >
                  {totalCount}
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
