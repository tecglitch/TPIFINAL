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
const toLocalDateTime = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

function OrganizerDashboardPage() {
  const { role, organizerProfile, eventList, updateEvent, anniversaryList, deleteAnniversary } = useAppState()
  const mine = eventList.filter((event) => event.organizer?.email === organizerProfile.email)
  const mineAnniversaries = anniversaryList.filter((item) => item.organizer?.email === organizerProfile.email)
  if (role !== 'organizer') return <PageLayout><section className="mx-auto max-w-3xl px-6 py-16"><Card className="p-8 text-center"><h1 className="text-2xl font-bold">Panel organizador restringido</h1><p className="mt-3">Necesitás una cuenta de organizador para acceder a esta sección.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link></Card></section></PageLayout>
  return <PageLayout><section className="mx-auto max-w-6xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Espacio de organización" title="Mis propuestas" action={<div className="flex flex-wrap gap-2"><Link to="/crear"><Button>Proponer evento</Button></Link><Link to="/efemerides/proponer"><Button variant="outline">Proponer efeméride</Button></Link></div>} />
    <p className="mb-6 rounded-box bg-info/10 p-4 text-sm">Tus eventos y efemérides se guardan en el backend.</p>
    <h2 className="mb-4 text-2xl font-bold">Mis eventos</h2>
    {mine.length ? <div className="grid gap-4">{mine.map((event) => <OrganizerEvent key={event.slug} event={event} updateEvent={updateEvent} />)}</div> : <Card className="p-8 text-center">Todavía no hay propuestas. <Link className="link link-primary" to="/crear">Crear una</Link></Card>}
    <h2 className="mb-4 mt-12 text-2xl font-bold">Mis efemérides</h2>
    {mineAnniversaries.length ? <div className="grid gap-4">{mineAnniversaries.map((item) => <OrganizerAnniversary key={item.id} item={item} deleteAnniversary={deleteAnniversary} />)}</div> : <Card className="p-8 text-center">Todavía no hay efemérides propuestas. <Link className="link link-primary" to="/efemerides/proponer">Proponer una</Link></Card>}
  </section></PageLayout>
}

function OrganizerEvent({ event, updateEvent }) {
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  function reschedule() {
    if (!date) return
    const duration = new Date(event.endAt).getTime() - new Date(event.startAt).getTime()
    updateEvent(event.slug, { status: 'rescheduled', previousStartAt: event.startAt, previousEndAt: event.endAt, startAt: date, endAt: toLocalDateTime(new Date(new Date(date).getTime() + duration)), reviewNote: 'Fecha actualizada por el organizador.' })
  }
  return <Card className="p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{event.title}</h2><p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong> · Perfil organizador: {event.organizer?.name}</p><p className="mt-1 text-sm text-base-content/70">{showDate(event.startAt)} · {event.location}, {event.city}</p></div><StatusBadge status={event.status} /></div>
    {event.reviewNote && <p className="mt-4 rounded-box bg-base-200 p-3 text-sm"><strong>Detalle:</strong> {event.reviewNote}</p>}
    {['published', 'rescheduled'].includes(event.status) && <div className="mt-4 grid gap-3 border-t border-base-300 pt-4 sm:grid-cols-[1fr_auto]"><label className="form-control"><span className="label-text mb-1 font-semibold">Nueva fecha y hora</span><input type="datetime-local" className="input input-bordered" value={date} onChange={(event) => setDate(event.target.value)} /></label><Button className="self-end" variant="outline" onClick={reschedule}>Reprogramar evento</Button></div>}
    {event.status === 'published' && <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="form-control"><span className="label-text mb-1 font-semibold">Motivo de cancelación</span><input className="input input-bordered" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explicá brevemente el motivo" /></label><Button className="self-end" variant="outline" onClick={() => reason.trim() && updateEvent(event.slug, { status: 'cancelled', reviewNote: reason.trim() })}>Cancelar evento</Button></div>}
    <div className="mt-4 flex flex-wrap gap-2 text-xs">{Object.entries(statusLabels).map(([key, label]) => event.status === key ? <span className="badge badge-outline" key={key}>{label}</span> : null)}</div>
  </Card>
}

function OrganizerAnniversary({ item, deleteAnniversary }) {
  const [error, setError] = useState('')
  async function remove() {
    if (!window.confirm('¿Querés eliminar esta efeméride?')) return
    try {
      await deleteAnniversary(item.id)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  return <Card className="p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{item.title}</h2><p className="mt-1 text-sm">{item.day}/{item.month} · Presenta: <strong>{item.organization}</strong></p><p className="mt-1 text-sm text-base-content/70">{item.description}</p></div><StatusBadge status={item.status} /></div>
    {item.reviewNote && <p className="mt-4 rounded-box bg-base-200 p-3 text-sm"><strong>Detalle:</strong> {item.reviewNote}</p>}
    {['pending', 'changes_requested', 'rejected'].includes(item.status) && <Button className="mt-4" variant="outline" onClick={remove}>Eliminar propuesta</Button>}
    {error && <p className="mt-3 text-sm text-error">{error}</p>}
  </Card>
}

export default OrganizerDashboardPage
