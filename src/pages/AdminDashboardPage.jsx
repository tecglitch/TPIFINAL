import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { useAppState } from '../AppStateContext'

const showDate = (value) => new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

function AdminDashboardPage() {
  const { role, eventList, updateEvent, deleteEvent, anniversaryList, updateAnniversary, deleteAnniversary } = useAppState()
  const ordered = useMemo(() => eventList
    .filter((event) => event.status === 'pending')
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt) || (a.submittedAt || '').localeCompare(b.submittedAt || '')), [eventList])
  const accepted = useMemo(() => eventList
    .filter((event) => ['published', 'rescheduled'].includes(event.status))
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)), [eventList])
  if (role !== 'admin') return <PageLayout><section className="mx-auto max-w-3xl px-6 py-16"><Card className="p-8 text-center"><h1 className="text-2xl font-bold">Administración restringida</h1><p className="mt-3">Necesitás una cuenta con rol administrador para acceder a esta sección.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link></Card></section></PageLayout>
  return <PageLayout><section className="mx-auto max-w-6xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Revisión" title="Panel de administración" />
    <p className="mb-6 rounded-box bg-info/10 p-4 text-sm">Las acciones de moderación se guardan en el backend. <Link className="link link-primary" to="/administracion/consultas">Ver consultas de contacto</Link></p>
    <h2 className="mb-2 text-2xl font-bold">Propuestas pendientes de revisión</h2>
    <p className="mb-4 text-sm text-base-content/70">{ordered.length} {ordered.length === 1 ? 'propuesta pendiente' : 'propuestas pendientes'} · Ordenadas por fecha del evento, de la más próxima a la más lejana.</p>
    {ordered.length ? <div className="grid gap-4">{ordered.map((event) => <ReviewEvent key={event.slug} event={event} updateEvent={updateEvent} />)}</div> : <Card className="p-8 text-center"><h3 className="text-xl font-bold">No hay propuestas pendientes</h3><p className="mt-2 text-base-content/70">Cuando un organizador envíe un evento, aparecerá en esta lista.</p></Card>}
    <h2 className="mb-2 mt-12 text-2xl font-bold">Eventos aceptados</h2>
    <p className="mb-4 text-sm text-base-content/70">Estos eventos están publicados y pueden eliminarse de la agenda.</p>
    {accepted.length ? <div className="grid gap-4">{accepted.map((event) => <AcceptedEvent key={event.slug} event={event} deleteEvent={deleteEvent} />)}</div> : <Card className="p-8 text-center">No hay eventos aceptados.</Card>}
    <h2 className="mb-4 mt-12 text-2xl font-bold">Efemérides propuestas</h2>
    <div className="grid gap-4">{anniversaryList.map((item) => <ReviewAnniversary key={item.id} item={item} updateAnniversary={updateAnniversary} deleteAnniversary={deleteAnniversary} />)}</div>
  </section></PageLayout>
}

function AcceptedEvent({ event, deleteEvent }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function remove() {
    const trimmedReason = reason.trim()
    if (!trimmedReason) return
    setError('')
    setLoading(true)
    try {
      await deleteEvent(event.slug, trimmedReason)
      setShowDeleteModal(false)
    } catch (requestError) {
      setError(requestError.message)
      setLoading(false)
    }
  }

  return <Card className="p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold">{event.title}</h3><p className="mt-1 text-sm">{showDate(event.startAt)} · {event.location}, {event.city}</p><p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong></p><StatusBadge status={event.status} /></div><Link className="link link-primary text-sm" to={`/eventos/${event.slug}`}>Ver ficha</Link></div>
    <Button className="mt-4" variant="neutral" disabled={loading} onClick={() => setShowDeleteModal(true)}>Eliminar evento</Button>
    {error && <p className="mt-3 text-sm text-error">{error}</p>}
    {showDeleteModal && <DeleteModal title="Eliminar evento" itemTitle={event.title} reason={reason} setReason={setReason} loading={loading} onCancel={() => setShowDeleteModal(false)} onConfirm={remove} />}
  </Card>
}

function DeleteModal({ title, itemTitle, reason, setReason, loading, onCancel, onConfirm }) {
  return <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"><div className="modal-box"><h3 id="delete-modal-title" className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-base-content/70">Se eliminará: {itemTitle}</p><label className="mt-4 grid gap-2"><span className="label-text font-semibold">Motivo de eliminación *</span><textarea className="textarea textarea-bordered" rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explicá por qué se elimina" autoFocus /></label><div className="modal-action"><Button variant="ghost" disabled={loading} onClick={onCancel}>Cancelar</Button><Button variant="neutral" disabled={!reason.trim() || loading} onClick={onConfirm}>{loading ? 'Eliminando...' : 'Confirmar eliminación'}</Button></div></div><div className="modal-backdrop" onClick={onCancel} /></div>
}

function ReviewEvent({ event, updateEvent }) {
  const [reason, setReason] = useState('')
  const reviewable = ['pending', 'changes_requested'].includes(event.status)
  return <Card className="p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold">{event.title}</h3><StatusBadge status={event.status} /></div><p className="mt-2 text-sm">{showDate(event.startAt)} · {event.location}, {event.city}</p><p className="mt-1 text-sm">Categoría: {event.category} · Entrada: {event.ticketType === 'paid' ? `Paga ${event.price || ''}` : 'Gratuita'}</p><p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong></p><p className="mt-1 text-sm">Organizador: {event.organizer?.name || 'Sin datos'} · {event.organizer?.email || ''} · {event.organizer?.phone || ''}</p><p className="mt-1 text-xs text-base-content/60">Enviado: {event.submittedAt || 'Fecha de muestra'}</p></div><Link className="link link-primary text-sm" to={`/eventos/${event.slug}`}>Ver ficha</Link></div>
    {event.reviewNote && <p className="mt-3 rounded-box bg-base-200 p-3 text-sm">Motivo/detalle: {event.reviewNote}</p>}
    {reviewable && <div className="mt-4 grid gap-3 border-t border-base-300 pt-4"><label className="form-control"><span className="label-text mb-1 font-semibold">Motivo para cambios o rechazo</span><textarea className="textarea textarea-bordered" rows="2" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Escribí el motivo antes de elegir una acción" /></label><div className="flex flex-wrap gap-2"><Button onClick={() => updateEvent(event.slug, { status: 'published', reviewNote: '' })}>Aprobar y publicar</Button><Button variant="outline" disabled={!reason.trim()} onClick={() => updateEvent(event.slug, { status: 'changes_requested', reviewNote: reason.trim() })}>Solicitar cambios</Button><Button variant="neutral" disabled={!reason.trim()} onClick={() => updateEvent(event.slug, { status: 'rejected', reviewNote: reason.trim() })}>Rechazar propuesta</Button></div></div>}
  </Card>
}

function ReviewAnniversary({ item, updateAnniversary, deleteAnniversary }) {
  const [reason, setReason] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const reviewable = item.status === 'pending' || item.status === 'changes_requested'

  async function remove() {
    const trimmedReason = deleteReason.trim()
    if (!trimmedReason) return
    setDeleteError('')
    setDeleting(true)
    try {
      await deleteAnniversary(item.id, trimmedReason)
      setShowDeleteModal(false)
    } catch (requestError) {
      setDeleteError(requestError.message)
      setDeleting(false)
    }
  }

  return <Card className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold">{item.title}</h3><p className="text-sm">{item.day}/{item.month} · Presenta: {item.organization} · Estado: <StatusBadge status={item.status} /></p><p className="mt-1 text-sm text-base-content/70">{item.description}</p>{item.reviewNote && <p className="mt-2 text-sm">Motivo: {item.reviewNote}</p>}</div></div>
    {reviewable && <div className="mt-4 grid gap-3"><input className="input input-bordered" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo de cambios o rechazo" /><div className="flex flex-wrap gap-2"><Button onClick={() => updateAnniversary(item.id, { status: 'published', reviewNote: '' })}>Publicar efeméride</Button><Button variant="outline" disabled={!reason.trim()} onClick={() => updateAnniversary(item.id, { status: 'changes_requested', reviewNote: reason.trim() })}>Solicitar cambios</Button><Button variant="neutral" disabled={!reason.trim()} onClick={() => updateAnniversary(item.id, { status: 'rejected', reviewNote: reason.trim() })}>Rechazar</Button></div></div>}
    {item.status === 'published' && <Button className="mt-4" variant="neutral" disabled={deleting} onClick={() => setShowDeleteModal(true)}>Eliminar efeméride</Button>}
    {deleteError && <p className="mt-3 text-sm text-error">{deleteError}</p>}
    {showDeleteModal && <DeleteModal title="Eliminar efeméride" itemTitle={item.title} reason={deleteReason} setReason={setDeleteReason} loading={deleting} onCancel={() => setShowDeleteModal(false)} onConfirm={remove} />}
  </Card>
}

export default AdminDashboardPage
