import Button from '../components/Button'
import EventCard from '../components/EventCard'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { events } from '../data/events'
import { Link } from 'react-router-dom'

function CalendarPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Agenda local"
          title="Calendario de eventos"
          action={<Button variant="outline">Este mes</Button>}
        />
        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input className="input input-bordered bg-base-100" type="search" placeholder="Buscar por nombre o lugar" />
          <select className="select select-bordered bg-base-100" defaultValue="todas">
            <option value="todas">Todas las categorías</option>
            <option value="cultura">Cultura</option>
            <option value="deportes">Deportes</option>
          </select>
          <input className="input input-bordered bg-base-100" type="date" />
        </div>
        <div className="mb-8 flex items-center justify-between rounded-box bg-base-100 p-4 shadow-sm">
          <Button variant="ghost" aria-label="Mes anterior">←</Button>
          <h3 className="text-xl font-bold">Enero 2026</h3>
          <Button variant="ghost" aria-label="Mes siguiente">→</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.slug}
              event={event}
              action={<Link to={`/eventos/${event.slug}`}><Button variant="ghost" className="text-primary">Ver más detalles</Button></Link>}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default CalendarPage
