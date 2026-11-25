const RECENT_EMAILS_KEY = 'agenda-goya:recent-emails:v1'
const MAX_RECENT_EMAILS = 5

// Lee los últimos correos guardados en el navegador.
export function readRecentEmails() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_EMAILS_KEY) || '[]')
    return Array.isArray(saved)
      ? saved.filter((email) => typeof email === 'string')
      : []
  } catch {
    return []
  }
}

// Normaliza el correo, lo coloca primero y conserva solo los cinco más recientes.
export function saveRecentEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) return

  const emails = readRecentEmails()
    .filter((item) => item.toLowerCase() !== normalizedEmail)
  localStorage.setItem(
    RECENT_EMAILS_KEY,
    JSON.stringify([normalizedEmail, ...emails].slice(0, MAX_RECENT_EMAILS)),
  )
}
