import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'

function OrganizerRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const { setRole, setOrganizerProfile } = useAppState()
  function register(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setOrganizerProfile({
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      organization: form.get('organization'),
    })
    setRole('organizer')
    setSubmitted(true)
  }
  return <PageLayout><section className="mx-auto max-w-3xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Sumate a la agenda" title="Registro de organización" />
    {submitted ? <Card className="p-8 text-center"><h2 className="text-2xl font-bold">Vista de registro completada</h2><p className="mt-3 text-base-content/70">No se creó una cuenta ni se enviaron datos. Activamos el modo de demostración organizador solo en esta sesión.</p><Link to="/organizador"><Button className="mt-5">Ir al panel demo</Button></Link></Card> : <Card className="p-6 md:p-8"><form className="grid gap-4 md:grid-cols-2" onSubmit={register}>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Nombre de la persona responsable *</span><input name="name" className="input input-bordered" required placeholder="Juan Pérez" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Email *</span><input name="email" className="input input-bordered" type="email" required placeholder="nombre@ejemplo.com" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Teléfono *</span><input name="phone" className="input input-bordered" type="tel" required placeholder="+54 3777 ..." /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Nombre público de organización *</span><input name="organization" className="input input-bordered" required placeholder="Vinos Masdeu" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Contraseña (demostración)</span><input className="input input-bordered" type="password" required minLength={6} /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Sitio web (opcional)</span><input className="input input-bordered" type="url" placeholder="https://" /></label>
      <label className="form-control md:col-span-2"><span className="label-text mb-1 font-semibold">Descripción de la organización (opcional)</span><textarea className="textarea textarea-bordered" rows="3" /></label>
      <p className="rounded-box bg-info/10 p-3 text-sm md:col-span-2">Este formulario solo muestra la experiencia. No guarda datos ni crea credenciales persistentes.</p>
      <Button className="md:col-span-2" type="submit">Continuar en modo demostración</Button>
    </form><p className="mt-5 text-sm">¿Ya tenés acceso? <Link className="link link-primary" to="/acceso">Ir al acceso</Link></p></Card>}
  </section></PageLayout>
}

export default OrganizerRegisterPage
