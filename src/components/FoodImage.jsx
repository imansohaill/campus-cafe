import { useState } from 'react'

// Shows the dish photo from public/images. If the file is missing or fails to load,
// it quietly falls back to the dish's emoji so the layout never breaks.
export default function FoodImage({ item, className }) {
  const [failed, setFailed] = useState(false)
  const src = item.image ? `${import.meta.env.BASE_URL}${item.image}` : null

  return (
    <div className={className} aria-hidden="true">
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="art-fallback">{item.emoji}</span>
      )}
    </div>
  )
}
