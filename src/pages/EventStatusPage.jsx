import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicEventStatus } from '../api'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import StatusBadge from '../components/StatusBadge'
import { getLocalDateTime } from '../data/events'

const statusTitles = {
  cancelled: 'Evento cancelado',
  deleted: 'Evento retirado de la agenda',
  suspended: 'Evento suspendido',
}

// El enlace guardado en el calendario consulta el estado vigente aunque la ficha pública ya no esté disponible.
export default function EventStatusPage() {
  const { slug } = useParams()
  const [result, setResult] = useState(null)
  const current = result?.slug === slug ? result : null
  const event = current?.event

  useEffect(() => {
    // Cancela la consulta anterior si cambia el evento o se abandona la página.
    const controller = new AbortController()
    getPublicEventStatus(slug, controller.signal)
      .then((event) => setResult({ slug, event }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ slug, error: error.status === 404
            ? 'Este evento no está disponible en la agenda.'
            : 'No se pudo consultar el estado. Intentá más tarde.' })
        }
      })
    return () => controller.abort()
  }, [slug])

  return (
    <PageLayout>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Card className="gap-4 p-6 md:p-8">
          <h1 className="text-2xl font-bold">{(event && statusTitles[event.status]) || 'Estado del evento'}</h1>
          {!current && <p role="status">Consultando estado…</p>}
          {current?.error && <p role="status">{current.error}</p>}
          {event?.title && <h2 className="text-lg font-semibold">{event.title}</h2>}
          {event?.title && <StatusBadge status={event.status} />}
          {event?.start_at && <p>{getLocalDateTime(event.start_at)} · {[event.location, event.city].filter(Boolean).join(', ')}</p>}
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-outline" to="/calendario">Ver calendario</Link>
            {event?.title && <Link className="btn btn-primary" to={`/eventos/${encodeURIComponent(slug)}`}>Ver ficha</Link>}
          </div>
        </Card>
      </section>
    </PageLayout>
  )
}
