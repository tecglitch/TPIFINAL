import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard'
import EventFilters from '../components/EventFilters'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { categories, isPublicEvent } from '../data/events'

const emptyFilters = { query: '', category: '', ticketType: '', status: '' }

function CalendarPage() {
  const [params] = useSearchParams()
  const [filters, setFilters] = useState(() => ({ ...emptyFilters, query: params.get('q') || '' }))
  const { eventList } = useAppState()
  const matches = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('es-AR')
    return eventList.filter(isPublicEvent).filter((event) => {
      const text = [event.title, event.location, event.category, event.city, event.organization].join(' ').toLocaleLowerCase('es-AR')
      return (!query || text.includes(query))
        && (!filters.category || event.category === filters.category)
        && (!filters.ticketType || event.ticketType === filters.ticketType)
        && (!filters.status || event.status === filters.status)
    }).sort((a, b) => new Date(a.startAt) - new Date(b.startAt) || (a.submittedAt || '').localeCompare(b.submittedAt || ''))
  }, [eventList, filters])

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Agenda local" title="Calendario de eventos" />
        <p className="mb-5 text-base-content/70">Esta agenda muestra eventos publicados y sus estados públicos: suspendidos, reprogramados, cancelados o pasados. Las propuestas pendientes de revisión se ven solo en los paneles de organizador y administración.</p>
        <EventFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} categories={categories.map((category) => category.name)} />
        <p className="mb-4 text-sm text-base-content/70" aria-live="polite">{matches.length} {matches.length === 1 ? 'resultado' : 'resultados'}</p>
        {matches.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{matches.map((event) => <EventCard key={event.slug} event={event} />)}</div> : <div className="rounded-box bg-base-100 p-10 text-center"><h3 className="text-xl font-bold">No encontramos coincidencias</h3><p className="mt-2 text-base-content/70">Probá cambiar la búsqueda o limpiar los filtros.</p></div>}
      </div>
    </PageLayout>
  )
}

export default CalendarPage
