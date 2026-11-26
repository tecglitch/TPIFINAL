import { useRef, useState } from 'react'
import { canSubscribeToEventAlerts } from '../data/events'
import { downloadCalendarItem, getGoogleCalendarUrl } from '../utils/calendar'
import EventAlertDialog from './EventAlertDialog'

// Ofrece agregar el elemento a Google Calendar o descargarlo como archivo ICS.
function CalendarButton({ item, className = '' }) {
  const dialogRef = useRef(null)
  const menuRef = useRef(null)
  const [downloadIcs, setDownloadIcs] = useState(false)
  const googleUrl = getGoogleCalendarUrl(item)
  const canSubscribe = canSubscribeToEventAlerts(item)

  function openAlerts(forDownload) {
    setDownloadIcs(forDownload)
    menuRef.current.open = false
    dialogRef.current.showModal()
  }

  function download() {
    downloadCalendarItem(item)
    menuRef.current.open = false
    dialogRef.current?.close()
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
      {canSubscribe && (
        <EventAlertDialog
          dialogRef={dialogRef}
          slug={item.slug}
          title={downloadIcs ? 'Descargar archivo .ics' : 'Agregar a Google Calendar'}
          onClose={() => menuRef.current?.querySelector('summary').focus()}
          renderAction={(requested) => downloadIcs
            ? <button type="button" className="btn btn-outline" onClick={download}>{requested ? 'Descargar archivo .ics' : 'Descargar sin avisos'}</button>
            : <a className="btn btn-outline" href={googleUrl} target="_blank" rel="noreferrer" onClick={() => dialogRef.current.close()}>{requested ? 'Abrir Google Calendar' : 'Agregar sin avisos'}</a>}
        />
      )}
    </>
  )
}

export default CalendarButton
