import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import eventImage from '../images/playita.png'

function AnniversaryProposalPage() {
  const { role, organizerProfile, submitAnniversary } = useAppState()
  const [submitted, setSubmitted] = useState(false)
  function send(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    submitAnniversary({ title: form.get('title'), description: form.get('description'), day: Number(form.get('day')), month: Number(form.get('month')), organization: form.get('organization'), image: form.get('image') || eventImage })
    setSubmitted(true)
  }
  return <PageLayout><section className="mx-auto max-w-3xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Memoria de Goya" title="Proponer una efeméride" />
    {role !== 'organizer' ? <Card className="p-7"><p>Activá el modo de demostración organizador para enviar una efeméride.</p><Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link></Card> : submitted ? <Card className="p-8 text-center"><h2 className="text-2xl font-bold">Efeméride agregada a revisión</h2><p className="mt-3 text-base-content/70">Está pendiente en la memoria de esta sesión y aparece en el panel de administración. Se perderá al recargar.</p><Link to="/organizador"><Button className="mt-5">Volver al panel</Button></Link></Card> : <Card className="p-6 md:p-8"><form className="grid gap-4" onSubmit={send}>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Título *</span><input name="title" className="input input-bordered" required /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Descripción *</span><textarea name="description" className="textarea textarea-bordered min-h-28" required /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="form-control"><span className="label-text mb-1 font-semibold">Día recurrente *</span><input name="day" className="input input-bordered" type="number" min="1" max="31" required /></label><label className="form-control"><span className="label-text mb-1 font-semibold">Mes *</span><select name="month" className="select select-bordered" defaultValue="" required><option value="" disabled>Elegir mes</option>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></label></div>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Organización pública que propone *</span><input name="organization" className="input input-bordered" defaultValue={organizerProfile.organization} required placeholder="Museo, institución o emprendimiento" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Imagen (URL, opcional)</span><input name="image" className="input input-bordered" type="url" /></label>
      <p className="rounded-box bg-info/10 p-4 text-sm">Las propuestas se muestran al administrador para revisión. Este flujo usa datos temporales en memoria y no los guarda en un servidor.</p><Button type="submit">Enviar a revisión</Button>
    </form></Card>}
  </section></PageLayout>
}

export default AnniversaryProposalPage
