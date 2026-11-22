import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { categories } from '../data/events'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'))
    reader.readAsDataURL(file)
  })
}

function CreateEventPage() {
  const { role, organizerProfile, submitEvent } = useAppState()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketType, setTicketType] = useState('free')
  const [imageMode, setImageMode] = useState('url')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageInputError, setImageInputError] = useState('')

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('')
      return undefined
    }
    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [imageFile])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = form.get('title')
    const slug = String(title).toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setError('')
    setLoading(true)
    try {
      const imageSource = imageMode === 'file' && imageFile
        ? { type: 'file', base64: await fileToBase64(imageFile), content_type: imageFile.type, filename: imageFile.name }
        : imageMode === 'url' && form.get('imageUrl')
          ? { type: 'url', url: form.get('imageUrl') }
          : null
      await submitEvent({ slug, title, category: form.get('category'), description: form.get('description'), imageSource, location: form.get('location'), city: form.get('city'), startAt: form.get('startAt'), endAt: form.get('endAt'), organization: form.get('organization'), ticketType, price: form.get('price'), ticketUrl: form.get('ticketUrl') })
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  if (role !== 'organizer') return <Navigate to="/acceso" replace />
  return <PageLayout><section className="mx-auto max-w-4xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Participá de la agenda" title="Proponer un evento" />
    {role !== 'organizer' ? <Card className="p-7"><p>Para crear propuestas necesitás una cuenta de organizador.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso de organizadores</Button></Link></Card> : submitted ? <Card className="items-center p-8 text-center md:p-12"><div className="mb-4 grid size-16 place-items-center rounded-full bg-success/15 text-3xl text-success">✓</div><h2 className="text-2xl font-bold">Propuesta enviada a revisión</h2><p className="mt-2 max-w-lg text-base-content/70">Tu propuesta está pendiente de aprobación. Podés consultar su estado en «Panel organizador».</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/organizador"><Button>Ir al Panel organizador</Button></Link><Button variant="outline" onClick={() => setSubmitted(false)}>Crear otra propuesta</Button></div></Card> : <Card className="p-6 md:p-8"><form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Título *</span><input name="title" className="input input-bordered w-full" required /></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Categoría *</span><select name="category" className="select select-bordered w-full" defaultValue="" required><option value="" disabled>Seleccionar categoría</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Organización pública que presenta *</span><select name="organization" className="select select-bordered w-full" defaultValue={organizerProfile.organization || organizerProfile.organizations?.[0] || ''} required><option value="" disabled>Seleccionar organización</option>{(organizerProfile.organizations?.length ? organizerProfile.organizations : [organizerProfile.organization].filter(Boolean)).map((organization) => <option key={organization} value={organization}>{organization}</option>)}</select></label>
        <fieldset className="grid gap-3 rounded-box border border-base-300 p-4 md:col-span-2">
          <legend className="px-2 font-semibold">Imagen (opcional)</legend>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2"><input type="radio" name="imageMode" className="radio radio-sm" checked={imageMode === 'url'} onChange={() => setImageMode('url')} /> Usar un enlace de imagen</label>
            <label className="flex items-center gap-2"><input type="radio" name="imageMode" className="radio radio-sm" checked={imageMode === 'file'} onChange={() => setImageMode('file')} /> Elegir archivo de la computadora</label>
          </div>
          {imageMode === 'url' ? <label className="grid w-full gap-2"><span className="label-text">Enlace directo a una imagen (máximo 5 MB)</span><input name="imageUrl" type="url" className="input input-bordered w-full" placeholder="https://..." /><span className="text-sm text-base-content/70">El peso del enlace se verifica al enviar. Si supera 5 MB, te avisaremos.</span></label> : <label className="grid w-full gap-2"><span className="label-text">Imagen JPG, PNG, WebP o AVIF (máximo 5 MB)</span><input name="imageFile" type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="file-input file-input-bordered w-full" aria-invalid={Boolean(imageInputError)} aria-describedby={imageInputError ? 'event-image-error' : undefined} onChange={(change) => {
            const selected = change.target.files?.[0] || null
            if (selected && !ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
              setImageInputError('El formato no es compatible. Elegí una imagen JPG, PNG, WebP o AVIF.')
              change.target.value = ''
              setImageFile(null)
              return
            }
            if (selected && selected.size > MAX_IMAGE_BYTES) {
              setImageInputError('La imagen supera el límite de 5 MB. Elegí un archivo más liviano.')
              change.target.value = ''
              setImageFile(null)
              return
            }
            setImageInputError('')
            setImageFile(selected)
          }} />{imageInputError && <span id="event-image-error" role="alert" className="rounded-box bg-error/15 px-3 py-2 text-sm font-medium text-error">{imageInputError}</span>}{imageFile && <span className="text-sm text-base-content/70">{imageFile.name} · {(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>}</label>}
          {imagePreview && <img src={imagePreview} alt="Vista previa de la imagen del evento" className="h-40 w-full rounded-box object-cover sm:w-72" />}
          <p className="text-sm text-base-content/70">El servidor la optimizará a WebP de 1200 × 675 px.</p>
        </fieldset>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Lugar *</span><input name="location" className="input input-bordered w-full" required /></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Ciudad *</span><input name="city" className="input input-bordered w-full" defaultValue="Goya, Corrientes" required /></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Inicio (fecha y hora) *</span><input name="startAt" type="datetime-local" className="input input-bordered w-full" required /></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Fin (fecha y hora) *</span><input name="endAt" type="datetime-local" className="input input-bordered w-full" required /></label>
      </div>
      <label className="grid w-full gap-2"><span className="label-text font-semibold">Descripción *</span><textarea name="description" className="textarea textarea-bordered min-h-32 w-full" required /></label>
      <fieldset className="grid gap-4 rounded-box border border-base-300 p-4 md:grid-cols-2"><legend className="px-2 font-bold">Entradas</legend>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Tipo *</span><select className="select select-bordered w-full" value={ticketType} onChange={(event) => setTicketType(event.target.value)}><option value="free">Gratuita</option><option value="paid">Paga</option></select></label>
        {ticketType === 'paid' && <><label className="grid w-full gap-2"><span className="label-text font-semibold">Precio *</span><input name="price" className="input input-bordered w-full" required placeholder="$ 5.000" /></label><label className="grid w-full gap-2 md:col-span-2"><span className="label-text font-semibold">Enlace de compra (opcional)</span><input name="ticketUrl" type="url" className="input input-bordered w-full" placeholder="https://" /></label></>}
      </fieldset>
      {error && <p className="rounded-box bg-error/15 p-4 text-sm text-error">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Link to="/calendario"><Button type="button" variant="ghost">Cancelar</Button></Link><Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar a revisión'}</Button></div>
    </form></Card>}
  </section></PageLayout>
}

export default CreateEventPage
