import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { login } from '../api'
import { useAppState } from '../AppStateContext'

function OrganizerAccessPage() {
  const { login: saveSession } = useAppState()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(event.currentTarget)
    try {
      const session = await login({ email: form.get('email'), password: form.get('password') })
      saveSession(session)
      navigate(session.user.role === 'admin' ? '/administracion' : '/organizador')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  return <PageLayout><section className="mx-auto max-w-2xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Espacio de gestión" title="Acceso de organizadores" />
    <Card className="p-6 md:p-8"><p className="mb-5 text-base-content/75">Ingresá con la cuenta creada en el backend para acceder a tu panel.</p>
      {error && <p className="mb-4 rounded-box bg-error/15 p-3 text-sm text-error">{error}</p>}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Correo electrónico</span><input name="email" className="input input-bordered" type="email" placeholder="organizador@ejemplo.com" required /></label>
        <label className="form-control"><span className="label-text mb-1 font-semibold">Contraseña</span><input name="password" className="input input-bordered" type="password" placeholder="••••••••" required /></label>
        <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
      </form>
      <p className="mt-5 text-sm">¿Todavía no tenés cuenta? <Link className="link link-primary" to="/registro">Registrá tu organización</Link></p>
      <p className="mt-4 rounded-box bg-info/10 p-3 text-sm">El panel de administración solo está disponible para cuentas con rol administrador.</p>
    </Card>
  </section></PageLayout>
}

export default OrganizerAccessPage
