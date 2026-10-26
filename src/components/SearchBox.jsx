export default function SearchBox({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="menu-search" className="visually-hidden">
        Search the menu
      </label>
      <input
        id="menu-search"
        type="search"
        className="search__input"
        placeholder="Search dishes…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
