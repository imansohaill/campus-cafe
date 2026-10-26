import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="status">
      <p className="status__title">Page not found</p>
      <p>That page doesn’t exist.</p>
      <Link to="/" className="btn btn--primary">
        Back to the menu
      </Link>
    </div>
  )
}
