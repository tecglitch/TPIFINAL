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
  return <PageLayout><section className="mx-auto max-w-2xl px-6 py-12 md:py-16"><SectionTitle eyebrow="Acceso a tu cuenta" title="Ingresar" />
    <Card className="p-6 md:p-8"><p className="mb-5 text-base-content/75">Ingresá con tu cuenta. Al iniciar sesión, se mostrarán las opciones de acuerdo con tu rol.</p>
      {error && <p className="mb-4 rounded-box bg-error/15 p-3 text-sm text-error">{error}</p>}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Correo electrónico</span><input name="email" className="input input-bordered w-full" type="email" required /></label>
        <label className="grid w-full gap-2"><span className="label-text font-semibold">Contraseña</span><input name="password" className="input input-bordered w-full" type="password" required /></label>
        <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
      </form>
      <p className="mt-5 text-sm">¿Todavía no tenés cuenta? <Link className="link link-primary" to="/registro">Registrá tu organización</Link></p>
    </Card>
  </section></PageLayout>
}

export default OrganizerAccessPage
