import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const FavouritesContext = createContext(null)

const STORAGE_KEY = 'canteen.favourites.v1'

function loadIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function FavouritesProvider({ children }) {
  const [ids, setIds] = useState(loadIds)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Ignore: favourites just won't persist.
    }
  }, [ids])

  const toggleFavourite = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const value = useMemo(() => ({ favourites: ids, toggleFavourite }), [ids, toggleFavourite])

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
}

export function useFavourites() {
  const context = useContext(FavouritesContext)
  if (!context) throw new Error('useFavourites must be used inside <FavouritesProvider>')
  return context
}
