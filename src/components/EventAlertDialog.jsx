import { useId, useState } from 'react'
import { subscribeToEventAlerts } from '../api'

function EventAlertDialog({ dialogRef, slug, title, onClose, renderAction }) {
  const titleId = useId()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function subscribe(event) {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    setError('')
    setLoading(true)
    try {
      const result = await subscribeToEventAlerts(slug, email)
      setMessage(result.message)
    } catch (requestError) {
      setError(requestError.status ? requestError.message : 'No pudimos conectarnos al servicio de avisos. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby={titleId} onClose={() => {
      setError('')
      onClose?.()
    }}>
      <div className="modal-box">
        <h2 id={titleId} className="text-xl font-bold">{title}</h2>
        {message
          ? <p role="status" className="mt-4 rounded-box bg-success/15 p-3">{message}</p>
          : <form className="mt-4 grid gap-3" onSubmit={subscribe}>
            <p>Dejá tu correo si querés que te avisemos de cambios de fecha, lugar o estado.</p>
            <label className="grid gap-1">
              <span className="font-semibold">Correo electrónico</span>
              <input className="input input-bordered w-full" type="email" name="email" autoComplete="email" maxLength={254} required />
            </label>
            {error && <p role="alert" className="text-sm text-error">{error}</p>}
            <button type="submit" className="btn btn-primary justify-self-start" disabled={loading}>{loading ? 'Solicitando…' : 'Solicitar avisos'}</button>
          </form>}
        <div className="modal-action flex-wrap">
          <form method="dialog">
            <button className="btn btn-ghost" type="submit">{renderAction || message ? 'Cerrar' : 'Continuar sin avisos'}</button>
          </form>
          {renderAction?.(Boolean(message))}
        </div>
      </div>
    </dialog>
  )
}

export default EventAlertDialog
