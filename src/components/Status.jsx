export function LoadingMessage({ children = 'Loading…' }) {
  return (
    <div className="status" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status--error" role="alert">
      <p className="status__title">Couldn’t load the menu</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
