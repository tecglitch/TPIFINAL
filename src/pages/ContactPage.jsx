import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { sendContactMessage } from '../api'
import { useAppState } from '../AppStateContext'

function ContactPage() {
  const { session } = useAppState()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError('')
    setSubmitted(false)
    setLoading(true)
    try {
      await sendContactMessage({
        name: form.get('name'),
        email: form.get('email'),
        subject: form.get('subject'),
        message: form.get('message'),
      })
      event.currentTarget.reset()
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Estamos para ayudarte"
          title="Contacto"
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            <Card className="p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-2xl">✉</div>
              <h2 className="text-xl font-bold">Escribinos</h2>
              <p className="mt-2 text-base-content/70">Mandanos un correo y te responderemos a la brevedad.</p>
              <a className="btn btn-outline mt-5" href="mailto:contacto@agendaciudad.com">contacto@agendaciudad.com</a>
            </Card>
            <Card className="p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-secondary/10 text-2xl">☎</div>
              <h2 className="text-xl font-bold">Llamanos</h2>
              <p className="mt-2 text-base-content/70">Atención de lunes a viernes de 8 a 16 h.</p>
              <a className="btn btn-outline mt-5" href="tel:+543777123456">+54 3777 123456</a>
            </Card>
          </div>
          <Card className="p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Enviá un mensaje</h2>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <input name="name" className="input input-bordered" required placeholder="Nombre" defaultValue={session?.user?.name || ''} />
              <input name="email" className="input input-bordered" type="email" required placeholder="Correo electrónico" defaultValue={session?.user?.email || ''} />
              <input name="subject" className="input input-bordered" placeholder="Asunto" />
              <textarea name="message" className="textarea textarea-bordered min-h-36" required placeholder="¿En qué podemos ayudarte?" />
              {submitted && <p className="rounded-box bg-success/15 p-3 text-sm text-success">Tu mensaje fue enviado correctamente.</p>}
              {error && <p className="rounded-box bg-error/15 p-3 text-sm text-error">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-2 w-full sm:w-auto sm:justify-self-end">{loading ? 'Enviando...' : 'Enviar mensaje'}</Button>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

export default ContactPage
