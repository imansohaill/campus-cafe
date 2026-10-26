export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  onlyFavourites,
  onToggleFavourites,
  favouriteCount,
}) {
  return (
    <div className="chips" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="chip"
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
      <button
        type="button"
        className="chip chip--fav"
        aria-pressed={onlyFavourites}
        onClick={onToggleFavourites}
      >
        <span aria-hidden="true">♥</span> Favourites only
        <span className="chip__count" aria-hidden="true">
          {favouriteCount}
        </span>
      </button>
    </div>
  )
}
