function escapeIcsText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function formatIcsDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function formatGoogleDate(value) {
  return formatIcsDate(value)
}

function formatDateOnly(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
}

function filenameFor(item) {
  return (item.slug || item.title || 'evento')
    .toLocaleLowerCase('es-AR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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
    `DESCRIPTION:${escapeIcsText(item.description)}`,
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
  const blob = new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filenameFor(item)}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function getGoogleCalendarUrl(item) {
  const isAnniversary = item.month && item.day && !item.startAt
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title,
    details: item.description || '',
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