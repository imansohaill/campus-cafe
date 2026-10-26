export default function QuantityControl({ name, value, min = 1, max = 20, onChange }) {
  return (
    <div className="qty" role="group" aria-label={`Quantity of ${name}`}>
      <button
        type="button"
        className="qty__btn"
        aria-label={`Decrease quantity of ${name}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output className="qty__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="qty__btn"
        aria-label={`Increase quantity of ${name}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
