const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000'
const EVENTS_API_URL = import.meta.env.VITE_EVENTS_API_URL || 'http://localhost:3000'

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(body?.message || body?.detail || 'No se pudo completar la operación')
    error.status = response.status
    throw error
  }
  return body
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

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

export function getEvents(token) {
  return request(`${EVENTS_API_URL}/events`, {
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
