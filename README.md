# Campus Canteen

A phone-first React app where students browse today's menu, open a dish, and build an order.

## Run it

```bash
npm install
npm run dev
npm test
npm run build
```

Requires Node.js 18 or later.

## Dish photos

Photos are stored in `public/images/` and listed in `public/menu.json` using the `image` field.

After installing dependencies, you can download starter photos with:

```bash
npm run images
```

This requires an internet connection. Existing images are not overwritten. If a photo is missing, the card displays the dish's emoji instead.

## What's where

- `public/menu.json` — menu data.
- `src/context/` — menu, cart, and favourites state.
- `src/components/` — reusable interface components.
- `src/pages/` — menu, item details, cart, and not-found pages.
- `src/styles.css` — responsive styling.

## Features

- Menu loaded from a local JSON file.
- Reusable React components and state management with `useState`.
- Search and category filters.
- Favourite dishes saved in `localStorage`.
- React Router for menu, item details, and cart pages.
- Shared cart state using React Context.
- Quantity controls and automatic cart totals.
- Responsive layout for mobile, tablet, and desktop.
- Loading, error, retry, and sold-out states.

## Notes

- Prices are in Pakistani rupees (Rs).
- One dish is marked unavailable to demonstrate the sold-out state.
- Placing an order is a demo: there is no backend, so it displays a confirmation and empties the cart.

## Screen recording: suggested 60-second script

1. Open the app at phone width and show the menu.
2. Filter by Drinks and search for mango.
3. Favourite a dish and enable the favourites-only filter.
4. Add two dishes to the cart and show the header count.
5. Open a dish, change its quantity, and add it to the cart.
6. Open the cart and demonstrate quantity and total updates.
7. Resize the window to show the responsive layout.