import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { DashboardEventDetails } from '../components/DashboardDetails'
import DashboardPanel from '../components/DashboardPanel'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import DashboardItem from '../components/DashboardItem'
import { useAppState } from '../AppStateContext'
import { canEditEvent } from '../data/events'

// Filtra las propuestas del usuario y muestra las acciones disponibles para su rol.
function OrganizerDashboardPage() {
  const { role, organizerProfile, eventList, updateEvent, anniversaryList, deleteAnniversary, resetDashboardPanels } = useAppState()
  useEffect(() => {
    if (role !== 'organizer') return undefined

    function handleVisibilityChange() {
      if (document.hidden) resetDashboardPanels()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      resetDashboardPanels()
    }
  }, [role, resetDashboardPanels])
  const mine = role === 'organizer' && organizerProfile?.email
    ? eventList.filter((event) => event.organizer?.email === organizerProfile.email)
    : []
  const mineAnniversaries = role === 'organizer' && organizerProfile?.email
    ? anniversaryList.filter((item) => item.organizer?.email === organizerProfile.email)
    : []
  const publishedEvents = mine.filter((event) => ['published', 'rescheduled', 'suspended', 'past'].includes(event.status))
  const cancelledEvents = mine.filter((event) => ['cancelled', 'deleted'].includes(event.status))
  const reviewEvents = mine.filter((event) => ['pending', 'changes_requested'].includes(event.status))
  const rejectedEvents = mine.filter((event) => event.status === 'rejected')
  const publishedAnniversaries = mineAnniversaries.filter((item) => item.status === 'published')
  const cancelledAnniversaries = mineAnniversaries.filter((item) => ['cancelled', 'deleted'].includes(item.status))
  const reviewAnniversaries = mineAnniversaries.filter((item) => ['pending', 'changes_requested'].includes(item.status))
  const rejectedAnniversaries = mineAnniversaries.filter((item) => item.status === 'rejected')
  if (role !== 'organizer') return <PageLayout><section className="mx-auto max-w-3xl px-6 py-16"><Card className="p-8 text-center"><h1 className="text-2xl font-bold">Panel organizador restringido</h1><p className="mt-3">Necesitás una cuenta de organizador para acceder a esta sección.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link></Card></section></PageLayout>
  return <PageLayout><section className="mx-auto max-w-6xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Espacio de organización" title="Mis propuestas" action={<div className="flex flex-wrap gap-2"><Link to="/crear"><Button>Proponer evento</Button></Link><Link to="/efemerides/proponer"><Button variant="outline">Proponer efeméride</Button></Link></div>} />
    <p className="mb-6 rounded-box bg-info/10 p-4 text-sm">Seguí el estado de tus propuestas y revisá las novedades sobre cada una.</p>
    <div className="grid gap-6">
      <div className="grid gap-2">
        <DashboardPanel panelId="organizer-review-events" title="Mis eventos en revisi&oacute;n" count={reviewEvents.length} highlightCount>
          {reviewEvents.length ? reviewEvents.map((event) => <DashboardItem key={event.slug} title={event.title} status={event.status} image={event.image}><OrganizerEvent event={event} updateEvent={updateEvent} /></DashboardItem>) : <EmptyOrganizerGroup>Todav&iacute;a no hay propuestas en revisi&oacute;n.</EmptyOrganizerGroup>}
        </DashboardPanel>
        <DashboardPanel panelId="organizer-review-anniversaries" title="Mis efem&eacute;rides en revisi&oacute;n" count={reviewAnniversaries.length} highlightCount>
          {reviewAnniversaries.length ? reviewAnniversaries.map((item) => <DashboardItem key={item.id} title={item.title} status={item.status} image={item.image}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></DashboardItem>) : <EmptyOrganizerGroup>Todav&iacute;a no hay efem&eacute;rides en revisi&oacute;n.</EmptyOrganizerGroup>}
        </DashboardPanel>
      </div>
      <div className="grid gap-2">
        <DashboardPanel panelId="organizer-published-events" title="Mis eventos publicados" count={publishedEvents.length}>
          {publishedEvents.length ? publishedEvents.map((event) => <DashboardItem key={event.slug} title={event.title} status={event.status} image={event.image}><OrganizerEvent event={event} updateEvent={updateEvent} /></DashboardItem>) : <EmptyOrganizerGroup>Sin eventos publicados.</EmptyOrganizerGroup>}
        </DashboardPanel>
        <DashboardPanel panelId="organizer-published-anniversaries" title="Mis efem&eacute;rides publicadas" count={publishedAnniversaries.length}>
          {publishedAnniversaries.length ? publishedAnniversaries.map((item) => <DashboardItem key={item.id} title={item.title} status={item.status} image={item.image}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></DashboardItem>) : <EmptyOrganizerGroup>Sin efem&eacute;rides publicadas.</EmptyOrganizerGroup>}
        </DashboardPanel>
      </div>
      <div className="grid gap-2">
        <DashboardPanel panelId="organizer-cancelled-events" title="Mis eventos cancelados" count={cancelledEvents.length}>
          {cancelledEvents.length ? cancelledEvents.map((event) => <DashboardItem key={event.slug} title={event.title} status={event.status} image={event.image}><OrganizerEvent event={event} updateEvent={updateEvent} /></DashboardItem>) : <EmptyOrganizerGroup>No hay eventos cancelados.</EmptyOrganizerGroup>}
        </DashboardPanel>
        <DashboardPanel panelId="organizer-cancelled-anniversaries" title="Mis efem&eacute;rides canceladas" count={cancelledAnniversaries.length}>
          {cancelledAnniversaries.length ? cancelledAnniversaries.map((item) => <DashboardItem key={item.id} title={item.title} status={item.status} image={item.image}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></DashboardItem>) : <EmptyOrganizerGroup>No hay efem&eacute;rides canceladas.</EmptyOrganizerGroup>}
        </DashboardPanel>
      </div>
      <div className="grid gap-2">
        <DashboardPanel panelId="organizer-rejected-events" title="Mis eventos rechazados" count={rejectedEvents.length}>
          {rejectedEvents.length ? rejectedEvents.map((event) => <DashboardItem key={event.slug} title={event.title} status={event.status} image={event.image}><OrganizerEvent event={event} updateEvent={updateEvent} /></DashboardItem>) : <EmptyOrganizerGroup>No hay eventos rechazados.</EmptyOrganizerGroup>}
        </DashboardPanel>
        <DashboardPanel panelId="organizer-rejected-anniversaries" title="Mis efem&eacute;rides rechazadas" count={rejectedAnniversaries.length}>
          {rejectedAnniversaries.length ? rejectedAnniversaries.map((item) => <DashboardItem key={item.id} title={item.title} status={item.status} image={item.image}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></DashboardItem>) : <EmptyOrganizerGroup>No hay efem&eacute;rides rechazadas.</EmptyOrganizerGroup>}
        </DashboardPanel>
      </div>
    </div>
  </section></PageLayout>
}

function EmptyOrganizerGroup({ children }) {
  return <p className="py-3 text-sm text-base-content/70">{children}</p>
}

// Muestra una propuesta propia y permite corregirla, reprogramarla o cancelarla.
function OrganizerEvent({ event, updateEvent }) {
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [reason, setReason] = useState('')
  const [rescheduling, setRescheduling] = useState(false)
  const [rescheduleError, setRescheduleError] = useState('')
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false)

  // Valida el nuevo rango horario y solicita la reprogramación al backend.
  async function reschedule() {
    setRescheduleError('')
    setRescheduleSuccess(false)
    if (!startAt || !endAt) {
      setRescheduleError('Elegí la fecha y hora de inicio y de finalización.')
      return
    }
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      setRescheduleError('La fecha y hora de finalización debe ser posterior al inicio.')
      return
    }

    setRescheduling(true)
    try {
      await updateEvent(event.slug, {
        status: 'rescheduled',
        startAt,
        endAt,
        reviewNote: 'Fecha y horario actualizados por el organizador.',
      })
      setStartAt('')
      setEndAt('')
      setRescheduleSuccess(true)
    } catch (requestError) {
      setRescheduleError(requestError.message || 'No se pudo reprogramar el evento.')
    } finally {
      setRescheduling(false)
    }
  }

  return (
    <DashboardEventDetails event={event}>
      {event.status === 'changes_requested' && (
        <div className="mt-4 rounded-box bg-warning/15 p-4">
          <p className="text-sm font-semibold">Administración solicitó cambios en esta propuesta.</p>
        </div>
      )}
      {canEditEvent(event) && (
        <Link className="btn btn-primary mt-4" to={`/eventos/${event.slug}/editar`}>
          Modificar evento
        </Link>
      )}
      {['published', 'rescheduled'].includes(event.status) && (
        <div className="mt-4 border-t border-base-300 pt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid w-full gap-2">
              <span className="label-text font-semibold">Nueva fecha y hora de inicio</span>
              <input type="datetime-local" className="input input-bordered w-full" value={startAt} onChange={(change) => { setStartAt(change.target.value); setRescheduleError(''); setRescheduleSuccess(false) }} />
            </label>
            <label className="grid w-full gap-2">
              <span className="label-text font-semibold">Nueva fecha y hora de finalización</span>
              <input type="datetime-local" className="input input-bordered w-full" value={endAt} min={startAt || undefined} onChange={(change) => { setEndAt(change.target.value); setRescheduleError(''); setRescheduleSuccess(false) }} />
            </label>
          </div>
          <Button className="mt-3 w-full sm:w-auto" variant="outline" onClick={reschedule} disabled={rescheduling}>
            {rescheduling ? 'Guardando...' : 'Reprogramar evento'}
          </Button>
          {rescheduleError && <p role="alert" className="mt-3 rounded-box bg-error/15 p-3 text-sm text-error">{rescheduleError}</p>}
          {rescheduleSuccess && <p role="status" className="mt-3 rounded-box bg-success/15 p-3 text-sm">Evento reprogramado correctamente.</p>}
        </div>
      )}
      {event.status === 'published' && (
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <label className="grid w-full gap-2">
            <span className="label-text font-semibold">Motivo de cancelación</span>
            <input className="input input-bordered w-full" value={reason} onChange={(change) => setReason(change.target.value)} placeholder="Explicá brevemente el motivo" />
          </label>
          <Button className="w-full self-end sm:w-44" variant="outline" onClick={() => reason.trim() && updateEvent(event.slug, { status: 'cancelled', reviewNote: reason.trim() })}>Cancelar evento</Button>
        </div>
      )}
    </DashboardEventDetails>
  )
}

// Presenta una efeméride propia y permite retirar propuestas no publicadas.
function OrganizerAnniversary({ item, deleteAnniversary }) {
  const [error, setError] = useState('')
  // Pide confirmación antes de eliminar y muestra errores de la API.
  async function remove() {
    if (!window.confirm('¿Querés eliminar esta efeméride?')) return
    try {
      await deleteAnniversary(item.id)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  return <Card className="p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mt-1 text-sm">{item.day}/{item.month} · Presenta: <strong>{item.organization}</strong></p><p className="mt-1 text-sm text-base-content/70">{item.description}</p></div></div>
    {item.reviewNote && <p className="mt-4 rounded-box bg-base-200 p-3 text-sm"><strong>Detalle:</strong> {item.reviewNote}</p>}
    {['pending', 'changes_requested', 'rejected'].includes(item.status) && <Button className="mt-4" variant="outline" onClick={remove}>Eliminar propuesta</Button>}
    {error && <p className="mt-3 text-sm text-error">{error}</p>}
  </Card>
}

export default OrganizerDashboardPage
