import { useMemo, useState } from 'react'
import { useMenu } from '../context/MenuContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import MenuList from '../components/MenuList.jsx'
import SearchBox from '../components/SearchBox.jsx'
import { ErrorMessage, LoadingMessage } from '../components/Status.jsx'

const todayLabel = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export default function MenuPage() {
  const { status, error, items, categories, reload } = useMenu()
  const { addItem, quantityById } = useCart()
  const { favourites, toggleFavourite } = useFavourites()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [onlyFavourites, setOnlyFavourites] = useState(false)

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (onlyFavourites && !favourites.includes(item.id)) return false
      if (!needle) return true
      return (
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle)
      )
    })
  }, [items, query, category, onlyFavourites, favourites])

  return (
    <>
      <div className="page-head">
        <h1>Today’s menu</h1>
        <p className="page-head__sub">{todayLabel}</p>
      </div>

      {status === 'loading' && <LoadingMessage>Loading today’s menu…</LoadingMessage>}
      {status === 'error' && <ErrorMessage message={error} onRetry={reload} />}

      {status === 'success' && (
        <div className="menu-layout">
          <section className="filters" aria-label="Search and filter">
            <SearchBox value={query} onChange={setQuery} />
            <CategoryFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
              onlyFavourites={onlyFavourites}
              onToggleFavourites={() => setOnlyFavourites((on) => !on)}
              favouriteCount={favourites.length}
            />
          </section>

          <section aria-label="Dishes" className="menu-results">
            <p className="results-count" role="status">
              {visibleItems.length} {visibleItems.length === 1 ? 'dish' : 'dishes'}
            </p>
            <MenuList
              items={visibleItems}
              favourites={favourites}
              quantityById={quantityById}
              onToggleFavourite={toggleFavourite}
              onAdd={(item) => addItem(item, 1)}
            />
          </section>
        </div>
      )}
    </>
  )
}
