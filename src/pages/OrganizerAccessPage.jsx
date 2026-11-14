import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'

function OrganizerAccessPage() {
  const { setRole } = useAppState()
  const navigate = useNavigate()
  function enterDemo(role) { setRole(role); navigate(role === 'admin' ? '/administracion' : '/organizador') }
  return <PageLayout><section className="mx-auto max-w-2xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Espacio de gestión" title="Acceso de organizadores" />
    <Card className="p-6 md:p-8"><p className="mb-5 text-base-content/75">La autenticación todavía no está conectada. Estos controles activan una vista de demostración temporal en memoria.</p>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); enterDemo('organizer') }}>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Correo electrónico</span><input className="input input-bordered" type="email" placeholder="organizador@ejemplo.com" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Contraseña</span><input className="input input-bordered" type="password" placeholder="••••••••" required /></label>
        <Button type="submit">Entrar al panel de demostración</Button>
      </form>
      <p className="mt-5 text-sm">¿Todavía no tenés cuenta? <Link className="link link-primary" to="/registro">Registrá tu organización</Link></p>
      <div className="divider">Revisión</div><Button variant="outline" className="w-full" onClick={() => enterDemo('admin')}>Abrir panel administrador de demostración</Button>
      <p className="mt-4 rounded-box bg-warning/15 p-3 text-sm">La selección de rol no protege rutas ni verifica identidad. La autorización segura requiere un backend.</p>
    </Card>
  </section></PageLayout>
}

export default OrganizerAccessPage
