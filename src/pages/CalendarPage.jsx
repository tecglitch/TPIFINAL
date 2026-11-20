import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard'
import EventFilters from '../components/EventFilters'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { categories, isPublicEvent } from '../data/events'

const emptyFilters = {
  query: '', organizer: '', category: '', ticketType: '', status: '',
  month: '', year: '', date: '', dateText: '', quickRange: '', multiDayOnly: false,
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dateInputRange(value) {
  const [year, month, day] = value.split('-').map(Number)
  return [new Date(year, month - 1, day), new Date(year, month - 1, day, 23, 59, 59, 999)]
}

function eventOverlapsRange(event, rangeStart, rangeEnd) {
  const eventStart = new Date(event.startAt)
  const eventEnd = new Date(event.endAt || event.startAt)
  return eventStart <= rangeEnd && eventEnd >= rangeStart
}

function quickRangeBounds(quickRange) {
  if (!quickRange) return null
  const today = startOfLocalDay(new Date())
  const endOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

  if (quickRange === 'today') return [today, endOfDay(today)]
  if (quickRange === 'weekend') {
    const weekday = today.getDay()
    const saturdayOffset = weekday === 0 ? -1 : (6 - weekday + 7) % 7
    const saturday = new Date(today)
    saturday.setDate(today.getDate() + saturdayOffset)
    const sunday = new Date(saturday)
    sunday.setDate(saturday.getDate() + 1)
    return [saturday, endOfDay(sunday)]
  }
  if (quickRange === 'next7') {
    const lastDay = new Date(today)
    lastDay.setDate(today.getDate() + 6)
    return [today, endOfDay(lastDay)]
  }
  if (quickRange === 'thisMonth') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
    return [firstDay, lastDay]
  }
  return null
}

function matchesMonthYear(event, selectedMonth, selectedYear) {
  if (!selectedMonth && !selectedYear) return true
  const eventStart = new Date(event.startAt)
  const eventEnd = new Date(event.endAt || event.startAt)
  const month = selectedMonth ? Number(selectedMonth) - 1 : null

  if (selectedYear) {
    const year = Number(selectedYear)
    const rangeStart = month === null ? new Date(year, 0, 1) : new Date(year, month, 1)
    const rangeEnd = month === null
      ? new Date(year, 11, 31, 23, 59, 59, 999)
      : new Date(year, month + 1, 0, 23, 59, 59, 999)
    return eventOverlapsRange(event, rangeStart, rangeEnd)
  }

  for (let year = eventStart.getFullYear(); year <= eventEnd.getFullYear(); year += 1) {
    const rangeStart = new Date(year, month, 1)
    const rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999)
    if (eventStart <= rangeEnd && eventEnd >= rangeStart) return true
  }
  return false
}

function CalendarPage() {
  const [params] = useSearchParams()
  const [filters, setFilters] = useState(() => ({ ...emptyFilters, query: params.get('q') || '' }))
  const { eventList, role } = useAppState()
  const visibleEvents = role === 'admin'
    ? eventList
    : eventList.filter((event) => !['deleted', 'cancelled'].includes(event.status))
  const years = [...new Set(visibleEvents.flatMap((event) => {
    const startYear = new Date(event.startAt).getFullYear()
    const endYear = new Date(event.endAt || event.startAt).getFullYear()
    return [startYear, endYear].filter((year) => Number.isFinite(year))
  }))].sort((a, b) => a - b)
  const matches = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('es-AR')
    const organizerQuery = filters.organizer.trim().toLocaleLowerCase('es-AR')
    const quickRange = quickRangeBounds(filters.quickRange)
    return visibleEvents.filter((event) => isPublicEvent(event) || (role === 'admin' && ['deleted', 'cancelled'].includes(event.status))).filter((event) => {
      const organization = [event.organization, event.organizer?.name].join(' ').toLocaleLowerCase('es-AR')
      const text = [event.title, event.location, event.category, event.city, organization].join(' ').toLocaleLowerCase('es-AR')
      const eventDuration = new Date(event.endAt || event.startAt) - new Date(event.startAt)
      return (!query || text.includes(query))
        && (!organizerQuery || organization.includes(organizerQuery))
        && (!filters.category || event.category === filters.category)
        && (!filters.ticketType || event.ticketType === filters.ticketType)
        && (!filters.status || event.status === filters.status)
        && (!filters.date || eventOverlapsRange(event, ...dateInputRange(filters.date)))
        && (!quickRange || eventOverlapsRange(event, ...quickRange))
        && matchesMonthYear(event, filters.month, filters.year)
        && (!filters.multiDayOnly || eventDuration > 24 * 60 * 60 * 1000)
    }).sort((a, b) => new Date(a.startAt) - new Date(b.startAt) || (a.submittedAt || '').localeCompare(b.submittedAt || ''))
  }, [visibleEvents, role, filters])

  return (
    <PageLayout>
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Agenda local" title="Calendario de eventos" />
        <p className="mb-5 text-base-content/70">Esta agenda muestra eventos publicados y sus estados públicos: suspendidos, reprogramados, cancelados o pasados. Las propuestas pendientes de revisión se ven solo en los paneles de organizador y administración.</p>
        <EventFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} categories={categories.map((category) => category.name)} years={years} />
        <p className="mb-4 text-sm text-base-content/70" aria-live="polite">{matches.length} {matches.length === 1 ? 'resultado' : 'resultados'}</p>
        {matches.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{matches.map((event) => <EventCard key={event.slug} event={event} />)}</div> : <div className="rounded-box bg-base-100 p-10 text-center"><h3 className="text-xl font-bold">No encontramos coincidencias</h3><p className="mt-2 text-base-content/70">Probá cambiar la búsqueda o limpiar los filtros.</p></div>}
      </div>
    </PageLayout>
  )
}

export default CalendarPage
