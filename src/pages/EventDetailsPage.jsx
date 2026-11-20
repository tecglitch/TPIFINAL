import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import CalendarButton from '../components/CalendarButton'
import FavoriteButton from '../components/FavoriteButton'
import PageLayout from '../components/PageLayout'
import StatusBadge from '../components/StatusBadge'
import { useAppState } from '../AppStateContext'
import { isPublicEvent } from '../data/events'

const dateLabel = (value) => new Date(value).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

function EventDetailsPage() {
  const { slug } = useParams()
  const { eventList, role } = useAppState()
  const event = eventList.find((item) => item.slug === slug)

  if (!event || (!isPublicEvent(event) && role !== 'admin')) return <PageLayout><section className="mx-auto max-w-3xl px-6 py-20 text-center"><h1 className="text-3xl font-black">{event ? 'Esta propuesta aún no es pública' : 'No encontramos ese evento'}</h1><p className="mt-3 text-base-content/70">{event ? 'Las propuestas en revisión solo están disponibles para administración.' : 'Puede que el enlace ya no esté disponible.'}</p><Link to="/calendario"><Button className="mt-6">Volver al calendario</Button></Link></section></PageLayout>

  const start = new Date(event.startAt)
  const end = new Date(event.endAt || event.startAt)
  const mapQuery = encodeURIComponent(`${event.location}, ${event.city}`)
  const date = `${dateLabel(event.startAt)}${start.toDateString() !== end.toDateString() ? ` al ${dateLabel(event.endAt)}` : ''}`
  const time = `${start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`

  return (
    <PageLayout>
      <article className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <Link className="link link-hover text-sm font-semibold text-primary" to="/calendario">← Volver a los eventos</Link>
        <div className="mt-6 overflow-hidden rounded-box bg-base-100 shadow-xl">
          <img className="h-64 w-full object-cover sm:h-80 md:h-[26rem]" src={event.image} alt={`Imagen de ${event.title}`} />
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="badge badge-primary badge-outline">{event.category}</span><StatusBadge status={event.status} /></div><div className="flex flex-wrap gap-2"><FavoriteButton slug={event.slug} /><CalendarButton item={event} className="btn-sm" /></div></div>
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-base-content/75">{event.description}</p>
            <div className="mt-8 grid gap-4 border-t border-base-300 pt-6 sm:grid-cols-2">
              <Detail label="Fecha" value={date} icon="▦" /><Detail label="Horario" value={time} icon="◷" />
              <Detail label="Lugar" value={event.location} icon="⌖" /><Detail label="Ciudad" value={event.city} icon="⌂" />
              <Detail label="Organización que presenta" value={event.organization} icon="◎" />
              <Detail label="Tipo de entrada" value={event.ticketType === 'paid' ? 'Paga' : 'Gratuita'} icon="$" />
              {event.ticketType === 'paid' && event.price && <Detail label="Precio" value={event.price} icon="$" />}
            </div>
            {event.ticketType === 'paid' && event.ticketUrl && <a className="btn btn-primary mt-5" href={event.ticketUrl} target="_blank" rel="noreferrer">Comprar entradas</a>}
            {event.previousStartAt && <div className="mt-5 rounded-box bg-info/10 p-4"><p className="font-bold">Evento reprogramado</p><p className="mt-1">Fecha anterior: {dateLabel(event.previousStartAt)}{event.previousEndAt ? ` al ${dateLabel(event.previousEndAt)}` : ''}</p><p>Nueva fecha: {dateLabel(event.startAt)}{event.endAt ? ` al ${dateLabel(event.endAt)}` : ''}</p></div>}
            {event.reviewNote && <div className="mt-5 rounded-box bg-warning/15 p-4"><p className="font-bold">Información del estado</p><p className="mt-1">{event.reviewNote}</p></div>}
            <section className="mt-10" aria-labelledby="location-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Cómo llegar</p><h2 id="location-heading" className="mt-1 text-2xl font-bold">Ubicación</h2><p className="mt-1 text-base-content/70">{event.location}, {event.city}</p></div>
                <a className="btn btn-outline btn-primary" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
              </div>
              <iframe className="h-72 w-full rounded-box border border-base-300" title={`Mapa de ${event.location}, ${event.city}`} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </section>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}

function Detail({ label, value, icon }) {
  return <div className="flex items-start gap-3 rounded-box bg-base-200 p-4"><span aria-hidden="true" className="text-xl">{icon}</span><div><p className="text-xs font-bold uppercase tracking-wide text-base-content/60">{label}</p><p className="mt-1 font-semibold">{value}</p></div></div>
}

export default EventDetailsPage
