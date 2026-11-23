import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { registerAccount } from '../api'
import { useAppState } from '../AppStateContext'
import { saveRecentEmail } from '../utils/recentEmails'

function OrganizerRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([''])
  const { login } = useAppState()
  async function register(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError('')
    setLoading(true)
    try {
      const session = await registerAccount({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        organizations: organizations.map((organization) => organization.trim()).filter(Boolean),
        organization: organizations.find((organization) => organization.trim())?.trim() || '',
        password: form.get('password'),
      })
      saveRecentEmail(form.get('email'))
      login(session)
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  return <PageLayout><section className="mx-auto max-w-3xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Sumate a la agenda" title="Registro de organización" />
    {submitted ? <Card className="p-8 text-center"><h2 className="text-2xl font-bold">Cuenta creada correctamente</h2><p className="mt-3 text-base-content/70">Ya podés gestionar tus propuestas desde el panel de organizador.</p><Link to="/organizador"><Button className="mt-5">Ir al panel</Button></Link></Card> : <Card className="p-6 md:p-8"><form className="grid gap-4 md:grid-cols-2" onSubmit={register}>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Nombre de la persona responsable *</span><input name="name" className="input input-bordered" required placeholder="Juan Pérez" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Email *</span><input name="email" className="input input-bordered" type="email" required placeholder="nombre@ejemplo.com" /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Teléfono *</span><input name="phone" className="input input-bordered" type="tel" required placeholder="+54 3777 ..." /></label>
      <fieldset className="form-control md:col-span-2"><legend className="label-text mb-2 font-semibold">Organizaciones públicas *</legend><div className="grid gap-3">{organizations.map((organization, index) => <div key={index} className="flex gap-2"><input className="input input-bordered w-full" value={organization} onChange={(event) => setOrganizations((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} required placeholder={index === 0 ? 'Organización principal' : 'Otro emprendimiento'} /><Button type="button" variant="outline" disabled={organizations.length === 1} onClick={() => setOrganizations((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Eliminar organización ${index + 1}`}>Eliminar</Button></div>)}</div><Button type="button" variant="ghost" className="mt-2 justify-self-start px-0" onClick={() => setOrganizations((current) => [...current, ''])}>+ Agregar otra organización</Button></fieldset>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Contraseña</span><input name="password" className="input input-bordered" type="password" required minLength={6} /></label>
      <label className="form-control"><span className="label-text mb-1 font-semibold">Sitio web (opcional)</span><input className="input input-bordered" type="url" placeholder="https://" /></label>
      <label className="form-control md:col-span-2"><span className="label-text mb-1 font-semibold">Descripción de la organización (opcional)</span><textarea className="textarea textarea-bordered" rows="3" /></label>
      {error && <p className="rounded-box bg-error/15 p-3 text-sm text-error md:col-span-2">{error}</p>}
      <Button className="md:col-span-2" type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Button>
    </form><p className="mt-5 text-sm">¿Ya tenés acceso? <Link className="link link-primary" to="/acceso">Ir al acceso</Link></p></Card>}
  </section></PageLayout>
}

export default OrganizerRegisterPage
