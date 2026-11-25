import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContactMessages } from '../api'
import { useAppState } from '../AppStateContext'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'

const showDate = (value) => new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

// Prepara un enlace de Gmail con el destinatario, asunto y saludo del mensaje.
function getGmailReplyUrl(item) {
  const subject = `Re: ${item.subject}`
  const body = `Hola ${item.name},\n\n`
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: item.email,
    su: subject,
    body,
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}

// Carga y presenta las consultas recibidas; solo el rol admin puede verlas.
function ContactMessagesPage() {
  const { role, session } = useAppState()
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role !== 'admin' || !session?.token) return undefined
    let active = true
    getContactMessages(session.token)
      .then((result) => {
        if (active) setMessages(Array.isArray(result) ? result : [])
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [role, session?.token])

  if (role !== 'admin') {
    return (
      <PageLayout>
        <section className="mx-auto max-w-3xl px-6 py-16">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold">Consultas restringidas</h1>
            <p className="mt-3">Necesitás una cuenta con rol administrador para ver los mensajes.</p>
            <Link to="/acceso"><Button className="mt-5">Ir al acceso</Button></Link>
          </Card>
        </section>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Contacto" title="Consultas recibidas" />
        <p className="mb-6 text-sm text-base-content/70">Mensajes enviados desde el formulario de contacto. Responder abre Gmail con la consulta preparada.</p>
        {loading && <Card className="p-8 text-center">Cargando consultas...</Card>}
        {error && <p className="mb-4 rounded-box bg-error/15 p-3 text-sm text-error">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold">Todavía no hay consultas</h2>
            <p className="mt-2 text-base-content/70">Cuando alguien envíe un mensaje desde Contacto, va a aparecer acá.</p>
          </Card>
        )}
        {!loading && messages.length > 0 && (
          <div className="grid gap-4">
            {messages.map((item) => (
              <Card key={item.id} className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{item.subject}</h2>
                    <p className="mt-1 text-sm">{item.name} · {item.email}</p>
                    <p className="mt-1 text-xs text-base-content/60">{showDate(item.submitted_at)}</p>
                  </div>
                  <a
                    className="btn btn-outline"
                    href={getGmailReplyUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Responder
                  </a>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm">{item.message}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  )
}

export default ContactMessagesPage
