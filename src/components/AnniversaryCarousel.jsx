import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CalendarButton from './CalendarButton'
import fallbackImage from '../images/playita.png'

const ROTATION_DELAY = 8000

export default function AnniversaryCarousel({ anniversaries, dateLabel }) {
  const [position, setPosition] = useState(0)
  const [cardFocused, setCardFocused] = useState(false)
  const count = anniversaries.length
  const hasMultiple = count > 1
  const anniversary = anniversaries[position % count]

  useEffect(() => {
    if (!hasMultiple || cardFocused) return undefined

    const timer = window.setTimeout(() => setPosition((current) => (current + 1) % count), ROTATION_DELAY)
    return () => window.clearTimeout(timer)
  }, [count, hasMultiple, cardFocused, position])

  function move(direction) {
    setPosition((current) => (current % count + direction + count) % count)
  }

  return (
    <div className={hasMultiple ? 'relative z-30 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-2' : 'relative z-30'}>
      {hasMultiple && <button type="button" className="home-carousel-arrow absolute top-26 left-2 z-10 -translate-y-1/2 md:static md:translate-y-0" aria-label="Efeméride anterior" onClick={() => move(-1)}>&lsaquo;</button>}
      <article
        key={anniversary.id}
        className={`grid h-[32rem] grid-rows-[13rem_1fr] overflow-hidden rounded-box bg-base-100 shadow-sm md:h-[19rem] md:grid-cols-[1fr_1.4fr] md:grid-rows-1 ${hasMultiple ? 'anniversary-slide' : ''}`}
        onFocus={() => setCardFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setCardFocused(false)
        }}
      >
        <img className="h-full w-full object-cover" src={anniversary.image || fallbackImage} alt="" />
        <div className="flex min-h-0 flex-col p-5 md:p-8">
          <p className="text-sm font-bold text-primary">Efeméride · {dateLabel}</p>
          <h3 className="mt-2 line-clamp-2 text-2xl font-black">{anniversary.title}</h3>
          <p className="anniversary-description mt-3 text-base-content/75">{anniversary.description}</p>
          <p className="mt-auto pt-2 text-sm">Propuesta de {anniversary.organization}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="btn btn-outline btn-sm" to={`/efemerides/${encodeURIComponent(anniversary.id)}`}>Ver más detalles</Link>
            <CalendarButton item={anniversary} className="btn-sm" />
          </div>
        </div>
      </article>
      {hasMultiple && <button type="button" className="home-carousel-arrow absolute top-26 right-2 z-10 -translate-y-1/2 md:static md:translate-y-0" aria-label="Efeméride siguiente" onClick={() => move(1)}>&rsaquo;</button>}
    </div>
  )
}
