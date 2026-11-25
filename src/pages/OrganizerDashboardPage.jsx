import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { useAppState } from '../AppStateContext'
import { statusLabels } from '../data/events'

const showDate = (value) => new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

// Filtra las propuestas del usuario y muestra las acciones disponibles para su rol.
function OrganizerDashboardPage() {
  const { role, organizerProfile, eventList, updateEvent, anniversaryList, deleteAnniversary } = useAppState()
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
        <OrganizerPanel title="Mis eventos en revisi&oacute;n" count={reviewEvents.length}>
          {reviewEvents.length ? reviewEvents.map((event) => <OrganizerItem key={event.slug} title={event.title} status={event.status}><OrganizerEvent event={event} updateEvent={updateEvent} /></OrganizerItem>) : <EmptyOrganizerGroup>Todav&iacute;a no hay propuestas en revisi&oacute;n.</EmptyOrganizerGroup>}
        </OrganizerPanel>
        <OrganizerPanel title="Mis efem&eacute;rides en revisi&oacute;n" count={reviewAnniversaries.length}>
          {reviewAnniversaries.length ? reviewAnniversaries.map((item) => <OrganizerItem key={item.id} title={item.title} status={item.status}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></OrganizerItem>) : <EmptyOrganizerGroup>Todav&iacute;a no hay efem&eacute;rides en revisi&oacute;n.</EmptyOrganizerGroup>}
        </OrganizerPanel>
      </div>
      <div className="grid gap-2">
        <OrganizerPanel title="Mis eventos publicados" count={publishedEvents.length}>
          {publishedEvents.length ? publishedEvents.map((event) => <OrganizerItem key={event.slug} title={event.title} status={event.status}><OrganizerEvent event={event} updateEvent={updateEvent} /></OrganizerItem>) : <EmptyOrganizerGroup>Sin eventos publicados.</EmptyOrganizerGroup>}
        </OrganizerPanel>
        <OrganizerPanel title="Mis efem&eacute;rides publicadas" count={publishedAnniversaries.length}>
          {publishedAnniversaries.length ? publishedAnniversaries.map((item) => <OrganizerItem key={item.id} title={item.title} status={item.status}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></OrganizerItem>) : <EmptyOrganizerGroup>Sin efem&eacute;rides publicadas.</EmptyOrganizerGroup>}
        </OrganizerPanel>
      </div>
      <div className="grid gap-2">
        <OrganizerPanel title="Mis eventos cancelados" count={cancelledEvents.length}>
          {cancelledEvents.length ? cancelledEvents.map((event) => <OrganizerItem key={event.slug} title={event.title} status={event.status}><OrganizerEvent event={event} updateEvent={updateEvent} /></OrganizerItem>) : <EmptyOrganizerGroup>No hay eventos cancelados.</EmptyOrganizerGroup>}
        </OrganizerPanel>
        <OrganizerPanel title="Mis efem&eacute;rides canceladas" count={cancelledAnniversaries.length}>
          {cancelledAnniversaries.length ? cancelledAnniversaries.map((item) => <OrganizerItem key={item.id} title={item.title} status={item.status}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></OrganizerItem>) : <EmptyOrganizerGroup>No hay efem&eacute;rides canceladas.</EmptyOrganizerGroup>}
        </OrganizerPanel>
      </div>
      <div className="grid gap-2">
        <OrganizerPanel title="Mis eventos rechazados" count={rejectedEvents.length}>
          {rejectedEvents.length ? rejectedEvents.map((event) => <OrganizerItem key={event.slug} title={event.title} status={event.status}><OrganizerEvent event={event} updateEvent={updateEvent} /></OrganizerItem>) : <EmptyOrganizerGroup>No hay eventos rechazados.</EmptyOrganizerGroup>}
        </OrganizerPanel>
        <OrganizerPanel title="Mis efem&eacute;rides rechazadas" count={rejectedAnniversaries.length}>
          {rejectedAnniversaries.length ? rejectedAnniversaries.map((item) => <OrganizerItem key={item.id} title={item.title} status={item.status}><OrganizerAnniversary item={item} deleteAnniversary={deleteAnniversary} /></OrganizerItem>) : <EmptyOrganizerGroup>No hay efem&eacute;rides rechazadas.</EmptyOrganizerGroup>}
        </OrganizerPanel>
      </div>
    </div>
  </section></PageLayout>
}

function OrganizerPanel({ title, count, children }) {
  const [isOpen, setIsOpen] = useState(true)
  return <details className="rounded-box border border-base-300 bg-base-100" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
    <summary className="cursor-pointer p-5 text-xl font-bold">{title}<span className="ml-2 text-sm font-normal text-base-content/60">({count})</span></summary>
    <div className="grid gap-3 px-5 pb-5">{children}</div>
  </details>
}

function OrganizerItem({ title, status, children }) {
  return <details className="rounded-box border border-base-300 bg-base-100">
    <summary className="min-h-16 cursor-pointer p-4 text-base font-semibold"><span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><span className="min-w-0 break-words">{title}</span><StatusBadge status={status} /></span></summary>
    <div className="border-t border-base-300 px-5 py-4">{children}</div>
  </details>
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
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          
          <p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong> &middot; Perfil organizador: {event.organizer?.name}</p>
          <p className="mt-1 text-sm text-base-content/70">{showDate(event.startAt)} &middot; {event.location}, {event.city}</p>
        </div>
      </div>
      {event.reviewNote && <p className="mt-4 rounded-box bg-base-200 p-3 text-sm"><strong>Detalle:</strong> {event.reviewNote}</p>}
      {event.status === 'changes_requested' && (
        <div className="mt-4 rounded-box bg-warning/15 p-4">
          <p className="mb-3 text-sm font-semibold">Administración solicitó cambios en esta propuesta.</p>
          <Link to={`/eventos/${event.slug}/editar`}>
            <Button>Modificar evento</Button>
          </Link>
        </div>
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
      <div className="mt-4 flex flex-wrap gap-2 text-xs">{Object.entries(statusLabels).map(([key, label]) => event.status === key ? <span className="badge badge-outline" key={key}>{label}</span> : null)}</div>
    </Card>
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
