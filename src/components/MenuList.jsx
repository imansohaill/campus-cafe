import ItemCard from './ItemCard.jsx'

export default function MenuList({
  items,
  favourites,
  quantityById,
  onToggleFavourite,
  onAdd,
}) {
  if (items.length === 0) {
    return (
      <p className="empty" role="status">
        No dishes match your search. Try another word or category.
      </p>
    )
  }

  return (
    <ul className="menu-grid">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isFavourite={favourites.includes(item.id)}
          quantityInCart={quantityById[item.id] ?? 0}
          onToggleFavourite={onToggleFavourite}
          onAdd={onAdd}
        />
      ))}
    </ul>
  )
}
