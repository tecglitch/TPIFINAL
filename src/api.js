const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000'
const EVENTS_API_URL = import.meta.env.VITE_EVENTS_API_URL || 'http://localhost:3000'

// Ejecuta una petición JSON común y convierte las respuestas no exitosas en errores.
async function request(url, options = {}, fallbackMessage = 'No se pudo completar la operación') {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(body?.message || body?.detail || fallbackMessage)
    error.status = response.status
    throw error
  }
  return body
}

// Añade el JWT al encabezado solo cuando hay una sesión activa.
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getPublicEventStatus(slug, signal) {
  return request(`${EVENTS_API_URL}/event-alerts/events/${encodeURIComponent(slug)}`, { signal })
}

export function subscribeToEventAlerts(slug, email) {
  return request(`${EVENTS_API_URL}/event-alerts/events/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }, 'El servicio de avisos no está disponible. Podés agregar el evento sin avisos.')
}

// Funciones para autenticación, cuentas y favoritos (Django).
export function login(credentials) {
  return request(`${AUTH_API_URL}/api/auth/login/`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function registerAccount(data) {
  return request(`${AUTH_API_URL}/api/auth/register/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getFavorites(token) {
  return request(`${AUTH_API_URL}/api/auth/favorites/`, {
    headers: authHeaders(token),
  })
}

export function addFavorite(slug, token) {
  return request(`${AUTH_API_URL}/api/auth/favorites/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ slug }),
  })
}

export function removeFavorite(slug, token) {
  return request(`${AUTH_API_URL}/api/auth/favorites/`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ slug }),
  })
}

// Funciones para mensajes, eventos y efemérides (Node API).
export function getContactMessages(token) {
  return request(`${EVENTS_API_URL}/contact`, {
    headers: authHeaders(token),
  })
}

export function sendContactMessage(data) {
  return request(`${EVENTS_API_URL}/contact`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getEvents(token, includeDeleted = false) {
  const query = includeDeleted ? '?include_deleted=true' : ''
  return request(`${EVENTS_API_URL}/events${query}`, {
    headers: authHeaders(token),
  })
}

export function createEvent(event, token) {
  return request(`${EVENTS_API_URL}/events`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(event),
  })
}

export function updateEventStatus(slug, data, token) {
  return request(`${EVENTS_API_URL}/events/${encodeURIComponent(slug)}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export function updateEventDetails(slug, event, token) {
  return request(`${EVENTS_API_URL}/events/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(event),
  })
}

export function deleteEvent(slug, reason, token) {
  return request(`${EVENTS_API_URL}/events/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  })
}

export function getAnniversaries(token, includeDeleted = false) {
  const query = includeDeleted ? '?include_deleted=true' : ''
  return request(`${EVENTS_API_URL}/anniversaries${query}`, {
    headers: authHeaders(token),
  })
}

export function createAnniversary(anniversary, token) {
  return request(`${EVENTS_API_URL}/anniversaries`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(anniversary),
  })
}

export function updateAnniversaryStatus(id, data, token) {
  return request(`${EVENTS_API_URL}/anniversaries/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export function deleteAnniversary(id, reason, token) {
  return request(`${EVENTS_API_URL}/anniversaries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  })
}
