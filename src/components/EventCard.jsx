import { Link } from 'react-router-dom'
import Button from './Button'
import FavoriteButton from './FavoriteButton'
import StatusBadge from './StatusBadge'

const dateLabel = (value) => new Date(value).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

function EventCard({ event, className = '' }) {
  const start = new Date(event.startAt)
  const end = new Date(event.endAt || event.startAt)
  const multiDay = start.toDateString() !== end.toDateString()
  return (
    <article className={`card overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-yellow-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${className}`}>
      <img className="h-40 w-full object-cover" src={event.image} alt={`Imagen de ${event.title}`} />
      <div className="card-body gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="badge badge-primary badge-outline">{event.category}</span>
          <StatusBadge status={event.status} />
        </div>
        <h3 className="card-title font-note-hand text-xl">{event.title}</h3>
        <p className="text-sm text-base-content/75">{event.description}</p>
        <dl className="font-note-hand grid gap-1 border-t border-base-300 pt-3 text-sm text-base-content/80">
          <div><dt className="inline font-semibold">Fecha: </dt><dd className="inline">{dateLabel(event.startAt)}{multiDay && ` al ${dateLabel(event.endAt)}`}</dd></div>
          <div><dt className="inline font-semibold">Lugar: </dt><dd className="inline">{event.location} · {event.city}</dd></div>
          <div><dt className="inline font-semibold">Presenta: </dt><dd className="inline">{event.organization}</dd></div>
        </dl>
        {event.status === 'rescheduled' && event.previousStartAt && <p className="text-sm text-info">Nueva fecha: {dateLabel(event.startAt)} · Antes: {dateLabel(event.previousStartAt)}</p>}
        <div className="card-actions mt-1 items-center justify-between">
          <FavoriteButton slug={event.slug} />
          <Link to={`/eventos/${event.slug}`}><Button variant="ghost" className="text-primary">Ver detalles</Button></Link>
        </div>
      </div>
    </article>
  )
}

export default EventCard
