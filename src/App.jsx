import { Route, Routes } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { FavouritesProvider } from './context/FavouritesContext.jsx'
import Layout from './components/Layout.jsx'
import MenuPage from './pages/MenuPage.jsx'
import ItemPage from './pages/ItemPage.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// The three providers sit above <Routes>, so the header (inside Layout) and every
// screen read the same cart: no screen keeps its own copy of the count or total.
export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <FavouritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<MenuPage />} />
              <Route path="item/:id" element={<ItemPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </FavouritesProvider>
      </CartProvider>
    </MenuProvider>
  )
}
