// Escapa caracteres especiales para que el texto sea válido dentro de un archivo ICS.
function escapeIcsText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Convierte fecha y hora al formato UTC requerido por los calendarios.
function formatIcsDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

// Usa el mismo formato de fecha para el enlace de Google Calendar.
function formatGoogleDate(value) {
  return formatIcsDate(value)
}

// Formatea una fecha local como AAAAMMDD para eventos de día completo.
function formatDateOnly(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
}

// Crea un nombre de archivo seguro a partir del slug o título.
function filenameFor(item) {
  return (item.slug || item.title || 'evento')
    .toLocaleLowerCase('es-AR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function calendarDetails(item) {
  const statusUrl = item.slug && typeof window !== 'undefined'
    ? new URL(`/eventos/${encodeURIComponent(item.slug)}/estado`, window.location.origin).href
    : ''
  return [item.description, statusUrl && `Consultar estado actualizado: ${statusUrl}`].filter(Boolean).join('\n\n')
}

function foldIcsLine(line) {
  const encoder = new TextEncoder()
  let width = 0
  let folded = ''
  for (const char of line) {
    const bytes = encoder.encode(char).length
    if (width + bytes > 75) {
      folded += '\r\n '
      width = 1
    }
    folded += char
    width += bytes
  }
  return folded
}

// Descarga un archivo .ics para importar el evento o efeméride en un calendario.
export function downloadCalendarItem(item) {
  const isAnniversary = item.month && item.day && !item.startAt
  const now = new Date()
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Agenda Ciudad//Eventos//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(`${item.slug || item.id}@agendaciudad.com`)}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `SUMMARY:${escapeIcsText(item.title)}`,
    `DESCRIPTION:${escapeIcsText(calendarDetails(item))}`,
    `LOCATION:${escapeIcsText([item.location, item.city].filter(Boolean).join(', '))}`,
  ]

  if (isAnniversary) {
    const date = new Date(now.getFullYear(), item.month - 1, item.day)
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)
    lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(date)}`)
    lines.push(`DTEND;VALUE=DATE:${formatDateOnly(nextDay)}`)
    lines.push('RRULE:FREQ=YEARLY')
  } else {
    lines.push(`DTSTART:${formatIcsDate(item.startAt)}`)
    lines.push(`DTEND:${formatIcsDate(item.endAt || item.startAt)}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  const blob = new Blob([`${lines.map(foldIcsLine).join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filenameFor(item)}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Construye el enlace de creación de evento en Google Calendar.
export function getGoogleCalendarUrl(item) {
  const isAnniversary = item.month && item.day && !item.startAt
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title,
    details: calendarDetails(item),
    location: [item.location, item.city].filter(Boolean).join(', '),
  })

  if (isAnniversary) {
    const date = new Date(new Date().getFullYear(), item.month - 1, item.day)
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)
    params.set('dates', `${formatDateOnly(date)}/${formatDateOnly(nextDay)}`)
    params.set('recur', 'RRULE:FREQ=YEARLY')
  } else {
    params.set('dates', `${formatGoogleDate(item.startAt)}/${formatGoogleDate(item.endAt || item.startAt)}`)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
