import { useId, useRef, useState } from 'react'
import { subscribeToEventAlerts } from '../api'
import { downloadCalendarItem, getGoogleCalendarUrl } from '../utils/calendar'

// Ofrece agregar el elemento a Google Calendar o descargarlo como archivo ICS.
function CalendarButton({ item, className = '' }) {
  const dialogRef = useRef(null)
  const menuRef = useRef(null)
  const titleId = useId()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadIcs, setDownloadIcs] = useState(false)
  const googleUrl = getGoogleCalendarUrl(item)
  const canSubscribe = item.slug && ['published', 'rescheduled'].includes(item.status)
    && new Date(item.endAt || item.startAt) >= new Date()

  function openAlerts(forDownload) {
    setDownloadIcs(forDownload)
    setError('')
    menuRef.current.open = false
    dialogRef.current.showModal()
  }

  function download() {
    downloadCalendarItem(item)
    menuRef.current.open = false
    dialogRef.current?.close()
  }

  async function subscribe(event) {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    setError('')
    setLoading(true)
    try {
      const result = await subscribeToEventAlerts(item.slug, email)
      setMessage(result.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <details ref={menuRef} className="dropdown dropdown-top dropdown-end">
        <summary className={`btn btn-outline ${className}`} aria-label={`Agregar ${item.title} al calendario`}>▦ Agregar al calendario</summary>
        <ul className="menu dropdown-content z-50 mb-2 w-56 max-w-[calc(100vw-2rem)] rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
          <li>{canSubscribe
            ? <button type="button" onClick={() => openAlerts(false)}>Google Calendar</button>
            : <a href={googleUrl} target="_blank" rel="noreferrer">Google Calendar</a>}</li>
          <li><button type="button" onClick={() => canSubscribe ? openAlerts(true) : download()}>Descargar archivo .ics</button></li>
        </ul>
      </details>
      {canSubscribe && <dialog ref={dialogRef} className="modal" aria-labelledby={titleId} onClose={() => menuRef.current?.querySelector('summary').focus()}>
        <div className="modal-box">
          <h2 id={titleId} className="text-xl font-bold">{downloadIcs ? 'Descargar archivo .ics' : 'Agregar a Google Calendar'}</h2>
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
            <form method="dialog"><button className="btn btn-ghost" type="submit">Cerrar</button></form>
            {downloadIcs
              ? <button type="button" className="btn btn-outline" onClick={download}>{message ? 'Descargar archivo .ics' : 'Descargar sin avisos'}</button>
              : <a className="btn btn-outline" href={googleUrl} target="_blank" rel="noreferrer" onClick={() => dialogRef.current.close()}>{message ? 'Abrir Google Calendar' : 'Agregar sin avisos'}</a>}
          </div>
        </div>
      </dialog>}
    </>
  )
}

export default CalendarButton
