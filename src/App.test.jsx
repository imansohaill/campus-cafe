import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

const cartCount = () => screen.getByTestId('cart-count')

describe('menu loading', () => {
  it('shows a loading message, then the menu from menu.json', async () => {
    renderApp()
    expect(screen.getByText(/loading today’s menu/i)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Chicken Fried Rice' })).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/menu.json', expect.anything())
  })

  it('shows an error message and recovers when retrying', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
    renderApp()

    expect(await screen.findByRole('alert')).toHaveTextContent(/error 500/i)

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { name: 'Chicken Fried Rice' })).toBeInTheDocument()
  })
})

describe('filtering and favourites', () => {
  it('filters by category and by search text', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Chicken Fried Rice' })

    await user.click(screen.getByRole('button', { name: 'Drinks' }))
    expect(screen.queryByRole('heading', { name: 'Chicken Fried Rice' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mango Shake' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search the menu' }), 'spring')
    expect(screen.getByRole('heading', { name: 'Veg Spring Rolls (4 pcs)' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Mango Shake' })).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'zzzz')
    expect(screen.getByText(/no dishes match/i)).toBeInTheDocument()
  })

  it('toggles a favourite and can filter to favourites only', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Chocolate Brownie' })

    const heart = screen.getByRole('button', { name: 'Favourite Chocolate Brownie' })
    expect(heart).toHaveAttribute('aria-pressed', 'false')
    await user.click(heart)
    expect(heart).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /favourites only/i }))
    expect(screen.getByRole('heading', { name: 'Chocolate Brownie' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Chicken Fried Rice' })).not.toBeInTheDocument()
  })
})

describe('cart shared through context', () => {
  it('keeps the header count and the cart total in sync across screens', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Chicken Fried Rice' })
    expect(cartCount()).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: 'Add Chicken Fried Rice to cart' }))
    await user.click(screen.getByRole('button', { name: 'Add Veg Spring Rolls (4 pcs) to cart' }))
    expect(cartCount()).toHaveTextContent('2')

    // Cart screen: total is 350 + 150.
    await user.click(screen.getByRole('link', { name: /cart, 2 items/i }))
    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent('Rs 500')

    // Change quantity on the cart screen; header and total both follow.
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Chicken Fried Rice' }))
    expect(cartCount()).toHaveTextContent('3')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('Rs 850')

    // Back on the menu the count is unchanged and the card shows what is in the cart.
    await user.click(screen.getByRole('link', { name: 'Menu' }))
    await screen.findByRole('heading', { name: 'Chicken Fried Rice' })
    expect(cartCount()).toHaveTextContent('3')
  })

  it('adds a chosen quantity from the item details screen', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(await screen.findByRole('link', { name: 'Iced Lemon Tea' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Iced Lemon Tea' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Iced Lemon Tea' }))
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(cartCount()).toHaveTextContent('2')
    expect(screen.getByText(/added 2 × iced lemon tea/i)).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'View cart' }))
    expect(screen.getByTestId('cart-total')).toHaveTextContent('Rs 200')
  })

  it('removes lines and shows the empty state', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(await screen.findByRole('button', { name: 'Add Chocolate Brownie to cart' }))
    await user.click(screen.getByRole('link', { name: /cart, 1 item/i }))

    await user.click(screen.getByRole('button', { name: 'Remove Chocolate Brownie from cart' }))
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(cartCount()).toHaveTextContent('0')
  })

  it('does not let a sold-out dish be added', async () => {
    renderApp()
    const button = await screen.findByRole('button', { name: 'Sweet & Sour Chicken is sold out' })
    expect(button).toBeDisabled()
  })

  it('shows a helpful message for an unknown dish', async () => {
    renderApp('/item/does-not-exist')
    const message = await screen.findByText(/couldn’t find that dish/i)
    expect(within(message.parentElement).getByRole('link', { name: /today’s menu/i })).toBeInTheDocument()
  })
})
