import { downloadCalendarItem, getGoogleCalendarUrl } from '../utils/calendar'

function CalendarButton({ item, className = '' }) {
  return <details className="dropdown dropdown-top dropdown-end">
    <summary className={`btn btn-outline ${className}`} aria-label={`Agregar ${item.title} al calendario`}>▦ Agregar al calendario</summary>
    <ul className="menu dropdown-content z-50 mb-2 w-56 max-w-[calc(100vw-2rem)] rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
      <li><a href={getGoogleCalendarUrl(item)} target="_blank" rel="noreferrer">Google Calendar</a></li>
      <li><button type="button" onClick={() => downloadCalendarItem(item)}>Descargar archivo .ics</button></li>
    </ul>
  </details>
}

export default CalendarButton