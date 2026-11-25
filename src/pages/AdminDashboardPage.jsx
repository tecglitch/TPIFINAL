import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { useAppState } from '../AppStateContext'

const showDate = (value) => new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

// Reúne propuestas para revisar y eventos aprobados, restringiendo la página a admin.
function AdminDashboardPage() {
  const { role, eventList, updateEvent, deleteEvent, anniversaryList, updateAnniversary, deleteAnniversary } = useAppState()
  const ordered = useMemo(() => eventList
    .filter((event) => event.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)), [eventList])
  const accepted = useMemo(() => eventList
    .filter((event) => ['published', 'rescheduled'].includes(event.status))
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)), [eventList])
  const pendingAnniversaries = useMemo(() => anniversaryList.filter((item) => ['pending', 'changes_requested'].includes(item.status)), [anniversaryList])
  const publishedAnniversaries = useMemo(() => anniversaryList.filter((item) => item.status === 'published'), [anniversaryList])
  if (role !== 'admin') return <PageLayout><section className="mx-auto max-w-3xl px-6 py-16"><Card className="p-8 text-center"><h1 className="text-2xl font-bold">Administración restringida</h1><p className="mt-3">Necesitás una cuenta con rol administrador para acceder a esta sección.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link></Card></section></PageLayout>
  return <PageLayout><section className="mx-auto max-w-6xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Revisión" title="Panel de administración" />
    <p className="mb-6 rounded-box bg-info/10 p-4 text-sm">Las acciones de moderación se guardan en el backend. <Link className="link link-primary" to="/administracion/consultas">Ver consultas de contacto</Link></p>
    <div className="grid gap-4">
      <AdminPanel title="Propuestas pendientes de revisi&oacute;n" count={ordered.length}>
        <p className="mb-4 text-sm text-base-content/70">Ordenadas desde la propuesta enviada m&aacute;s recientemente.</p>
        {ordered.length ? ordered.map((event) => <AdminItem key={event.slug} title={event.title} status={event.status}><ReviewEvent event={event} updateEvent={updateEvent} /></AdminItem>) : <p className="py-4 text-sm text-base-content/70">No hay propuestas pendientes.</p>}
      </AdminPanel>
      <AdminPanel title="Efem&eacute;rides pendientes de revisi&oacute;n" count={pendingAnniversaries.length}>
        {pendingAnniversaries.length ? pendingAnniversaries.map((item) => <AdminItem key={item.id} title={item.title} status={item.status}><ReviewAnniversary item={item} updateAnniversary={updateAnniversary} deleteAnniversary={deleteAnniversary} /></AdminItem>) : <p className="py-4 text-sm text-base-content/70">No hay efem&eacute;rides pendientes.</p>}
      </AdminPanel>
      <AdminPanel title="Eventos aceptados" count={accepted.length}>
        <p className="mb-4 text-sm text-base-content/70">Estos eventos est&aacute;n publicados y pueden eliminarse de la agenda.</p>
        {accepted.length ? accepted.map((event) => <AdminItem key={event.slug} title={event.title} status={event.status}><AcceptedEvent event={event} deleteEvent={deleteEvent} /></AdminItem>) : <p className="py-4 text-sm text-base-content/70">No hay eventos aceptados.</p>}
      </AdminPanel>
      <AdminPanel title="Efem&eacute;rides publicadas" count={publishedAnniversaries.length}>
        {publishedAnniversaries.length ? publishedAnniversaries.map((item) => <AdminItem key={item.id} title={item.title} status={item.status}><ReviewAnniversary item={item} updateAnniversary={updateAnniversary} deleteAnniversary={deleteAnniversary} /></AdminItem>) : <p className="py-4 text-sm text-base-content/70">No hay efem&eacute;rides publicadas.</p>}
      </AdminPanel>
    </div>
  </section></PageLayout>
}

function AdminPanel({ title, count, children }) {
  const [isOpen, setIsOpen] = useState(true)
  return <details className="rounded-box border border-base-300 bg-base-100" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
    <summary className="cursor-pointer p-5 text-xl font-bold">{title}<span className="ml-2 text-sm font-normal text-base-content/60">({count})</span></summary>
    <div className="grid gap-3 px-5 pb-5">{children}</div>
  </details>
}

function AdminItem({ title, status, children }) {
  return <details className="rounded-box border border-base-300 bg-base-100">
    <summary className="min-h-16 cursor-pointer p-4 text-base font-semibold"><span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><span className="min-w-0 break-words">{title}</span><StatusBadge status={status} /></span></summary>
    <div className="border-t border-base-300 px-5 py-4">{children}</div>
  </details>
}

// Permite confirmar la baja lógica de un evento indicando un motivo.
function AcceptedEvent({ event, deleteEvent }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Envía el motivo y mantiene el diálogo abierto si la petición falla.
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

  return <div className="grid gap-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mt-1 text-sm">{showDate(event.startAt)} · {event.location}, {event.city}</p><p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong></p></div><Link className="link link-primary text-sm" to={`/eventos/${event.slug}`}>Ver ficha</Link></div>
    <Button className="mt-4" variant="neutral" disabled={loading} onClick={() => setShowDeleteModal(true)}>Eliminar evento</Button>
    {error && <p className="mt-3 text-sm text-error">{error}</p>}
    {showDeleteModal && <DeleteModal title="Eliminar evento" itemTitle={event.title} reason={reason} setReason={setReason} loading={loading} onCancel={() => setShowDeleteModal(false)} onConfirm={remove} />}
  </div>
}

// Diálogo compartido para confirmar una eliminación con motivo obligatorio.
function DeleteModal({ title, itemTitle, reason, setReason, loading, onCancel, onConfirm }) {
  return <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"><div className="modal-box"><h3 id="delete-modal-title" className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-base-content/70">Se eliminará: {itemTitle}</p><label className="mt-4 grid gap-2"><span className="label-text font-semibold">Motivo de eliminación *</span><textarea className="textarea textarea-bordered" rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explicá por qué se elimina" autoFocus /></label><div className="modal-action"><Button variant="ghost" disabled={loading} onClick={onCancel}>Cancelar</Button><Button variant="neutral" disabled={!reason.trim() || loading} onClick={onConfirm}>{loading ? 'Eliminando...' : 'Confirmar eliminación'}</Button></div></div><div className="modal-backdrop" onClick={onCancel} /></div>
}

// Presenta una propuesta y las acciones para publicarla, pedir cambios o rechazarla.
function ReviewEvent({ event, updateEvent }) {
  const [reason, setReason] = useState('')
  const reviewable = ['pending', 'changes_requested'].includes(event.status)
  return <div className="grid gap-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mt-2 text-sm">{showDate(event.startAt)} · {event.location}, {event.city}</p><p className="mt-1 text-sm">Categoría: {event.category} · Entrada: {event.ticketType === 'paid' ? `Paga ${event.price || ''}` : 'Gratuita'}</p><p className="mt-1 text-sm">Presenta: <strong>{event.organization}</strong></p><p className="mt-1 text-sm">Organizador: {event.organizer?.name || 'Sin datos'} · {event.organizer?.email || ''} · {event.organizer?.phone || ''}</p><p className="mt-1 text-xs text-base-content/60">Enviado: {event.submittedAt || 'Fecha de muestra'}</p></div><Link className="link link-primary text-sm" to={`/eventos/${event.slug}`}>Ver ficha</Link></div>
    {event.reviewNote && <p className="mt-3 rounded-box bg-base-200 p-3 text-sm">Motivo/detalle: {event.reviewNote}</p>}
    {reviewable && <div className="mt-4 grid gap-3 border-t border-base-300 pt-4"><label className="grid w-full gap-2"><span className="font-semibold">Motivo para cambios o rechazo</span><textarea className="textarea textarea-bordered w-full" rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Escrib&iacute; el motivo antes de elegir una acci&oacute;n" /></label><div className="flex flex-wrap gap-2"><Button onClick={() => updateEvent(event.slug, { status: 'published', reviewNote: '' })}>Aprobar y publicar</Button><Button variant="outline" disabled={!reason.trim()} onClick={() => updateEvent(event.slug, { status: 'changes_requested', reviewNote: reason.trim() })}>Solicitar cambios</Button><Button variant="neutral" disabled={!reason.trim()} onClick={() => updateEvent(event.slug, { status: 'rejected', reviewNote: reason.trim() })}>Rechazar propuesta</Button></div></div>}
  </div>
}

// Modera una efeméride y permite dar de baja las que ya están publicadas.
function ReviewAnniversary({ item, updateAnniversary, deleteAnniversary }) {
  const [reason, setReason] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const reviewable = item.status === 'pending' || item.status === 'changes_requested'

  // Elimina la efeméride después de confirmar el motivo requerido por el backend.
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

  return <div className="grid gap-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm">{item.day}/{item.month} - Presenta: {item.organization}</p><p className="mt-1 text-sm text-base-content/70">{item.description}</p>{item.reviewNote && <p className="mt-2 text-sm">Motivo: {item.reviewNote}</p>}</div></div>
    {reviewable && <div className="mt-4 grid gap-3"><label className="grid w-full gap-2"><span className="font-semibold">Motivo de cambios o rechazo</span><textarea className="textarea textarea-bordered w-full" rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Escrib&iacute; el motivo antes de elegir una acci&oacute;n" /></label><div className="flex flex-wrap gap-2"><Button onClick={() => updateAnniversary(item.id, { status: 'published', reviewNote: '' })}>Publicar efeméride</Button><Button variant="outline" disabled={!reason.trim()} onClick={() => updateAnniversary(item.id, { status: 'changes_requested', reviewNote: reason.trim() })}>Solicitar cambios</Button><Button variant="neutral" disabled={!reason.trim()} onClick={() => updateAnniversary(item.id, { status: 'rejected', reviewNote: reason.trim() })}>Rechazar</Button></div></div>}
    {item.status === 'published' && <Button className="mt-4" variant="neutral" disabled={deleting} onClick={() => setShowDeleteModal(true)}>Eliminar efeméride</Button>}
    {deleteError && <p className="mt-3 text-sm text-error">{deleteError}</p>}
    {showDeleteModal && <DeleteModal title="Eliminar efeméride" itemTitle={item.title} reason={deleteReason} setReason={setDeleteReason} loading={deleting} onCancel={() => setShowDeleteModal(false)} onConfirm={remove} />}
  </div>
}

export default AdminDashboardPage

