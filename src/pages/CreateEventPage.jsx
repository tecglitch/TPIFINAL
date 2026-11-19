import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { categories } from '../data/events'
import eventImage from '../images/playita.png'

function CreateEventPage() {
  const { role, organizerProfile, submitEvent } = useAppState()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketType, setTicketType] = useState('free')
  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = form.get('title')
    const slug = String(title).toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setError('')
    setLoading(true)
    try {
      await submitEvent({ slug, title, category: form.get('category'), description: form.get('description'), image: form.get('image') || eventImage, location: form.get('location'), city: form.get('city'), startAt: form.get('startAt'), endAt: form.get('endAt'), organization: form.get('organization'), ticketType, price: form.get('price'), ticketUrl: form.get('ticketUrl') })
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  if (role !== 'organizer') return <Navigate to="/acceso" replace />
  return <PageLayout><section className="mx-auto max-w-4xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Participá de la agenda" title="Proponer un evento" />
    {role !== 'organizer' ? <Card className="p-7"><p>Para crear propuestas necesitás una cuenta de organizador.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso de organizadores</Button></Link></Card> : submitted ? <Card className="items-center p-8 text-center md:p-12"><div className="mb-4 grid size-16 place-items-center rounded-full bg-success/15 text-3xl text-success">✓</div><h2 className="text-2xl font-bold">Propuesta enviada a revisión</h2><p className="mt-2 max-w-lg text-base-content/70">La propuesta quedó guardada en el backend.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/organizador"><Button>Ver mis propuestas</Button></Link><Button variant="outline" onClick={() => setSubmitted(false)}>Crear otra propuesta</Button></div></Card> : <Card className="p-6 md:p-8"><form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control"><span className="label-text mb-1 font-semibold">Título *</span><input name="title" className="input input-bordered" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Categoría *</span><select name="category" className="select select-bordered" defaultValue="" required><option value="" disabled>Seleccionar categoría</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Organización pública que presenta *</span><input name="organization" className="input input-bordered" defaultValue={organizerProfile.organization} placeholder="Ej. Vinos Masdeu" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Imagen (URL, opcional)</span><input name="image" type="url" className="input input-bordered" placeholder="Se usará una imagen de muestra si queda vacío" /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Lugar *</span><input name="location" className="input input-bordered" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Ciudad *</span><input name="city" className="input input-bordered" defaultValue="Goya, Corrientes" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Inicio (fecha y hora) *</span><input name="startAt" type="datetime-local" className="input input-bordered" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Fin (fecha y hora) *</span><input name="endAt" type="datetime-local" className="input input-bordered" required /></label>
      </div>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Descripción *</span><textarea name="description" className="textarea textarea-bordered min-h-32" required /></label>
      <fieldset className="grid gap-4 rounded-box border border-base-300 p-4 md:grid-cols-2"><legend className="px-2 font-bold">Entradas</legend>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Tipo *</span><select className="select select-bordered" value={ticketType} onChange={(event) => setTicketType(event.target.value)}><option value="free">Gratuita</option><option value="paid">Paga</option></select></label>
        {ticketType === 'paid' && <><label className="form-control"><span className="label-text mb-1 font-semibold">Precio *</span><input name="price" className="input input-bordered" required placeholder="$ 5.000" /></label><label className="form-control md:col-span-2"><span className="label-text mb-1 font-semibold">Enlace de compra (opcional)</span><input name="ticketUrl" type="url" className="input input-bordered" placeholder="https://" /></label></>}
      </fieldset>
      {error && <p className="rounded-box bg-error/15 p-4 text-sm text-error">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Link to="/calendario"><Button type="button" variant="ghost">Cancelar</Button></Link><Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar a revisión'}</Button></div>
    </form></Card>}
  </section></PageLayout>
}

export default CreateEventPage
