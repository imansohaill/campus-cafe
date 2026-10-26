import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const MenuContext = createContext(null)

// Loads public/menu.json once and shares it, so the Menu screen and the Item details
// screen (which can be opened directly from a link) read the same data.
export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMenu() {
      setStatus('loading')
      setError('')
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}menu.json`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`The menu could not be loaded (error ${response.status}).`)
        }
        const data = await response.json()
        if (!data || !Array.isArray(data.items)) {
          throw new Error('The menu file is not in the expected format.')
        }
        setMenu(data)
        setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        if (err instanceof SyntaxError) {
          setError('The menu file is not valid JSON.')
        } else if (err instanceof TypeError) {
          setError('Could not reach the menu. Check your connection and try again.')
        } else {
          setError(err.message || 'Something went wrong while loading the menu.')
        }
        setStatus('error')
      }
    }

    loadMenu()
    return () => controller.abort()
  }, [attempt])

  const value = useMemo(() => {
    const items = menu?.items ?? []
    const categories = ['All', ...new Set(items.map((item) => item.category))]
    return {
      status,
      error,
      items,
      categories,
      getItem: (id) => items.find((item) => item.id === id),
      reload: () => setAttempt((n) => n + 1),
    }
  }, [menu, status, error])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) throw new Error('useMenu must be used inside <MenuProvider>')
  return context
}
