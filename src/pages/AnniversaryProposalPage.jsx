import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import eventImage from '../images/playita.png'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, fileToBase64 } from '../utils/imageFiles'

// Formulario para que un organizador proponga una efeméride con imagen opcional.
function AnniversaryProposalPage() {
  const { role, organizerProfile, submitAnniversary } = useAppState()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState('url')
  const [selectedImage, setSelectedImage] = useState(null)
  const imageFile = selectedImage?.file
  const imagePreview = selectedImage?.previewUrl
  const [imageInputError, setImageInputError] = useState('')

  useEffect(() => {
    if (!imagePreview) return undefined
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  // Valida y envía el formulario; prepara la imagen como archivo o como URL.
  async function send(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError('')
    setLoading(true)
    try {
      const imageSource = imageMode === 'file' && imageFile
        ? { type: 'file', base64: await fileToBase64(imageFile), content_type: imageFile.type, filename: imageFile.name }
        : imageMode === 'url' && form.get('imageUrl')
          ? { type: 'url', url: form.get('imageUrl') }
          : null
      await submitAnniversary({ title: form.get('title'), description: form.get('description'), day: Number(form.get('day')), month: Number(form.get('month')), organization: form.get('organization'), image: imageSource ? null : eventImage, imageSource })
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  if (role !== 'organizer') return <Navigate to="/acceso" replace />
  return <PageLayout><section className="mx-auto max-w-3xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Memoria de Goya" title="Proponer una efeméride" />
    {submitted ? <Card className="p-8 text-center"><h2 className="text-2xl font-bold">Efeméride agregada a revisión</h2><p className="mt-3 text-base-content/70">Tu efeméride quedó pendiente de revisión. Podés consultar su estado desde «Panel organizador».</p><Link to="/organizador"><Button className="mt-5">Volver al panel</Button></Link></Card> : <Card className="p-6 md:p-8"><form className="grid gap-4" onSubmit={send}>
      <label className="flex w-full flex-col items-stretch gap-2"><span className="label-text font-semibold">Título *</span><input name="title" className="input input-bordered w-full" required /></label>
      <label className="flex w-full flex-col items-stretch gap-2"><span className="label-text font-semibold">Descripción *</span><textarea name="description" className="textarea textarea-bordered min-h-28 w-full" required /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="flex w-full flex-col items-stretch gap-2"><span className="label-text font-semibold">Día recurrente *</span><input name="day" className="input input-bordered w-full" type="number" min="1" max="31" required /></label><label className="flex w-full flex-col items-stretch gap-2"><span className="label-text font-semibold">Mes *</span><select name="month" className="select select-bordered w-full" defaultValue="" required><option value="" disabled>Elegir mes</option>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></label></div>
      <label className="flex w-full flex-col items-stretch gap-2"><span className="label-text font-semibold">Organización pública que propone *</span><select name="organization" className="select select-bordered w-full" defaultValue={organizerProfile.organization || organizerProfile.organizations?.[0] || ''} required><option value="" disabled>Seleccionar organización</option>{(organizerProfile.organizations?.length ? organizerProfile.organizations : [organizerProfile.organization].filter(Boolean)).map((organization) => <option key={organization} value={organization}>{organization}</option>)}</select></label>
      <fieldset className="grid gap-3 rounded-box border border-base-300 p-4">
        <legend className="px-2 font-semibold">Imagen (opcional)</legend>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2"><input type="radio" name="imageMode" className="radio radio-sm" checked={imageMode === 'url'} onChange={() => setImageMode('url')} /> Usar un enlace de imagen</label>
          <label className="flex items-center gap-2"><input type="radio" name="imageMode" className="radio radio-sm" checked={imageMode === 'file'} onChange={() => setImageMode('file')} /> Elegir archivo de la computadora</label>
        </div>
        {imageMode === 'url' ? <label className="grid w-full gap-2"><span className="label-text">Enlace directo a una imagen (máximo 5 MB)</span><input name="imageUrl" type="url" className="input input-bordered w-full" placeholder="https://..." /><span className="text-sm text-base-content/70">El peso del enlace se verifica al enviar. Si supera 5 MB, te avisaremos.</span></label> : <label className="grid w-full gap-2"><span className="label-text">Imagen JPG, PNG, WebP o AVIF (máximo 5 MB)</span><input name="imageFile" type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="file-input file-input-bordered w-full" aria-invalid={Boolean(imageInputError)} aria-describedby={imageInputError ? 'anniversary-image-error' : undefined} onChange={(change) => {
          const selected = change.target.files?.[0] || null
          if (selected && !ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
            setImageInputError('El formato no es compatible. Elegí una imagen JPG, PNG, WebP o AVIF.')
            change.target.value = ''
            setSelectedImage(null)
            return
          }
          if (selected && selected.size > MAX_IMAGE_BYTES) {
            setImageInputError('La imagen supera el límite de 5 MB. Elegí un archivo más liviano.')
            change.target.value = ''
            setSelectedImage(null)
            return
          }
          setImageInputError('')
          setSelectedImage(selected ? { file: selected, previewUrl: URL.createObjectURL(selected) } : null)
        }} />{imageInputError && <span id="anniversary-image-error" role="alert" className="rounded-box bg-error/15 px-3 py-2 text-sm font-medium text-error">{imageInputError}</span>}{imageFile && <span className="text-sm text-base-content/70">{imageFile.name} · {(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>}</label>}
        {imagePreview && <img src={imagePreview} alt="Vista previa de la imagen de la efeméride" className="h-40 w-full rounded-box object-cover sm:w-72" />}
        <p className="text-sm text-base-content/70">El servidor la optimizará a WebP de 1200 × 675 px.</p>
      </fieldset>
      <p className="rounded-box bg-info/10 p-4 text-sm">Al enviar tu propuesta, quedará pendiente de revisión. Podés consultar su estado desde «Panel organizador».</p>{error && <p className="rounded-box bg-error/15 p-4 text-sm text-error">{error}</p>}<Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar a revisión'}</Button>
    </form></Card>}
  </section></PageLayout>
}

export default AnniversaryProposalPage
