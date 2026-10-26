# Campus Canteen

A phone-first React app where students browse today's menu, open a dish, and build an order.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 9 tests (loading, error/retry, filters, favourites, cart sync)
npm run build      # production build in dist/
```

Requires Node 18+.

## Dish photos

Photos live in `public/images/<dish-id>.jpg` and are listed in `public/menu.json` (the `image` field).
After `npm install`, download a starter set with:

```bash
npm run images
```

It needs internet and saves one photo per dish (existing files are never overwritten). The photos are
keyword matches from loremflickr.com, so swap any you don't like by saving your own image over the file
with the same name. If a photo is missing, the card shows the dish's emoji instead, so nothing breaks.

## What's where

```
public/menu.json            The menu. Edit this file to change the menu; nothing is typed into the UI.
src/context/
  MenuContext.jsx           useEffect + fetch/async-await loads menu.json; loading / error / retry
  CartContext.jsx           Cart state (useState): add, change quantity, remove, clear, count, total
  FavouritesContext.jsx     Favourite dish ids (useState)
src/components/
  Header.jsx                Brand, nav, cart count badge (on every screen)
  MenuList.jsx, ItemCard.jsx, Cart.jsx, QuantityControl.jsx
  SearchBox.jsx, CategoryFilter.jsx, Status.jsx
src/pages/                  MenuPage, ItemPage, CartPage, NotFoundPage
src/styles.css              Mobile-first CSS: Flexbox + Grid, breakpoints at 640px and 1024px
```

## How the requirements are met

- **Menu from a local JSON file**: `MenuProvider` fetches `/menu.json` in a `useEffect` with `async/await`, with an `AbortController`, a loading message, and an error message with a "Try again" button.
- **Reusable components with props and `useState`**: `MenuList` → `ItemCard`, `Cart`, `QuantityControl`, `CategoryFilter`, `SearchBox`. Search text, selected category and the favourites-only toggle are `useState` in `MenuPage`.
- **Favourite toggle**: heart button on each card and on the details screen; saved in `localStorage`. "Favourites only" filters the menu.
- **React Router**: `/` Menu, `/item/:id` Item details (works when opened directly), `/cart` Cart, plus a not-found route.
- **Cart shared with Context**: `CartProvider` sits above the routes. The header badge, the cards ("2 in your cart"), the details screen and the cart total all read the same state, so they update instantly with no reload. The cart survives a page refresh (`localStorage`).
- **Responsive**: semantic HTML (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`); one-column cards on phones, 2 columns on tablets, a 3-column grid with a sticky filter sidebar on desktop; 44px touch targets.

## Notes

- Prices are in Pakistani rupees (`Rs`). One dish in `menu.json` is marked `"available": false` to show the sold-out state.
- "Place order" is a demo: there is no backend, so it shows a confirmation and empties the cart.

## Screen recording: suggested ~60-second script

1. Open the app at phone width (browser dev tools → device toolbar), show the loading message and the menu.
2. Tap **Drinks**, then type "mango" in search; clear it, tap **All**.
3. Tap the heart on one dish; toggle **Favourites only**.
4. Tap **Add** on two dishes: point at the header count going up.
5. Open a dish, set quantity to 2, **Add to cart**.
6. Open **Cart**: change a quantity and watch the total and header count change; go back to **Menu** and show the count is unchanged.
7. Widen the window to tablet, then desktop, to show the layout change.
