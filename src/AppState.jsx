import { useCallback, useEffect, useMemo, useState } from 'react'
import { anniversaries as initialAnniversaries, events as initialEvents } from './data/events'
import {
  createAnniversary,
  createEvent,
  deleteAnniversary as deleteAnniversaryRequest,
  deleteEvent as deleteEventRequest,
  addFavorite as addFavoriteRequest,
  getFavorites,
  removeFavorite as removeFavoriteRequest,
  getAnniversaries,
  getEvents,
  updateAnniversaryStatus,
  updateEventDetails as updateEventDetailsRequest,
  updateEventStatus,
} from './api'
import { StateContext } from './AppStateContext'

const FAVORITES_KEY = 'agenda-goya:favorites:v1'
const SESSION_KEY = 'agenda-goya:session:v1'

// Normaliza fechas al formato ISO que esperan las APIs.
function toApiDateTime(value) {
  return value ? new Date(value).toISOString() : value
}

// Recupera favoritos locales y descarta datos inválidos o JSON corrupto.
function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((slug) => typeof slug === 'string') : []
  } catch {
    return []
  }
}

// Recupera la sesión almacenada solo si contiene token y usuario.
function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return saved?.token && saved?.user ? saved : null
  } catch {
    return null
  }
}

// Adapta los nombres de campos de la API al formato usado por la interfaz.
function fromApiEvent(event) {
  return {
    ...event,
    startAt: event.start_at,
    endAt: event.end_at,
    previousStartAt: event.previous_start_at,
    previousEndAt: event.previous_end_at,
    ticketType: event.ticket_type,
    ticketUrl: event.ticket_url,
    submittedAt: event.submitted_at,
    reviewNote: event.review_note,
    organizer: {
      name: event.organization,
      email: event.organizer_email,
    },
  }
}

// Convierte una propuesta del frontend al formato que recibe la API.
function toApiEvent(event) {
  return {
    slug: event.slug,
    title: event.title,
    category: event.category,
    description: event.description,
    image: null,
    image_source: event.imageSource || null,
    start_at: toApiDateTime(event.startAt),
    end_at: toApiDateTime(event.endAt),
    location: event.location,
    city: event.city,
    organization: event.organization,
    ticket_type: event.ticketType,
    price: event.price || null,
    ticket_url: event.ticketUrl || null,
  }
}

// Prepara una efeméride para enviarla al backend.
function toApiAnniversary(anniversary) {
  return {
    title: anniversary.title,
    description: anniversary.description,
    day: anniversary.day,
    month: anniversary.month,
    organization: anniversary.organization,
    image: anniversary.image || null,
    image_source: anniversary.imageSource || null,
  }
}

// Adapta una efeméride de la API al formato usado por la interfaz.
function fromApiAnniversary(anniversary) {
  return {
    ...anniversary,
    submittedAt: anniversary.submitted_at,
    reviewNote: anniversary.review_note,
    organizer: {
      email: anniversary.organizer_email,
    },
  }
}

// Centraliza la sesión, los eventos, las efemérides y las acciones disponibles para las páginas.
export function AppStateProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const [openDashboardPanels, setOpenDashboardPanels] = useState({})
  const resetDashboardPanels = useCallback(() => setOpenDashboardPanels({}), [])
  const [favoriteSlugs, setFavoriteSlugs] = useState(readFavorites)
  const [eventList, setEventList] = useState(initialEvents)
  const [anniversaryList, setAnniversaryList] = useState(initialAnniversaries)

  useEffect(() => {
    if (!session) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteSlugs))
    }
  }, [favoriteSlugs, session])

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  }, [session])

  useEffect(() => {
    getEvents(session?.token, session?.user?.role === 'admin')
      .then((events) => {
        setEventList(events.map(fromApiEvent))
      })
      .catch((error) => {
        if (error.status === 401) setSession(null)
      })
  }, [session?.token, session?.user?.role])

  useEffect(() => {
    if (!session?.token) return
    getFavorites(session.token)
      .then((result) => setFavoriteSlugs(result.favorites || []))
      .catch((error) => {
        if (error.status === 401) setSession(null)
      })
  }, [session?.token])

  useEffect(() => {
    getAnniversaries(session?.token, session?.user?.role === 'admin')
      .then((anniversaries) => {
        setAnniversaryList(anniversaries.map(fromApiAnniversary))
      })
      .catch((error) => {
        if (error.status === 401) setSession(null)
      })
  }, [session?.token, session?.user?.role])

  const role = session?.user?.role || 'visitor'
  const organizerProfile = session?.user || null

  const value = useMemo(() => ({
    role,
    organizerProfile,
    session,
    login: (newSession) => {
      resetDashboardPanels()
      setSession(newSession)
    },
    openDashboardPanels,
    resetDashboardPanels,
    setDashboardPanelOpen: (panelId, open) => {
      setOpenDashboardPanels((current) => current[panelId] === open
        ? current
        : { ...current, [panelId]: open })
    },
    // Limpia la sesión y vuelve a los favoritos locales al cerrar sesión.
    logout: () => {
      setSession(null)
      setFavoriteSlugs(readFavorites())
    },
    favoriteSlugs,
    // Actualiza la interfaz primero y revierte el cambio si falla la petición al backend.
    toggleFavorite: async (slug) => {
      const isSaved = favoriteSlugs.includes(slug)
      setFavoriteSlugs((current) => isSaved
        ? current.filter((item) => item !== slug)
        : [...current, slug])
      if (!session?.token) return true
      try {
        if (isSaved) await removeFavoriteRequest(slug, session.token)
        else await addFavoriteRequest(slug, session.token)
      } catch (error) {
        setFavoriteSlugs((current) => isSaved
          ? [...current, slug]
          : current.filter((item) => item !== slug))
        if (error.status === 401) setSession(null)
        return false
      }
      return true
    },
    eventList,
    // Envía una propuesta nueva y sincroniza la lista local con la respuesta.
    submitEvent: async (proposal) => {
      const saved = await createEvent(toApiEvent(proposal), session?.token)
      const mapped = fromApiEvent(saved)
      setEventList((current) => [mapped, ...current.filter((event) => event.slug !== mapped.slug)])
      return mapped
    },
    // Guarda correcciones solicitadas y reemplaza el evento actualizado en el estado.
    updateEventDetails: async (slug, proposal) => {
      const saved = await updateEventDetailsRequest(slug, toApiEvent(proposal), session?.token)
      const mapped = fromApiEvent(saved)
      setEventList((current) => current.map((event) => event.slug === slug ? mapped : event))
      return mapped
    },
    // Actualiza estado o fechas del evento y refleja el resultado devuelto por la API.
    updateEvent: async (slug, updates) => {
      const saved = await updateEventStatus(slug, {
        status: updates.status,
        review_note: updates.reviewNote || '',
        start_at: toApiDateTime(updates.startAt),
        end_at: toApiDateTime(updates.endAt),
      }, session?.token)
      const mapped = fromApiEvent(saved)
      setEventList((current) => current.map((event) => event.slug === slug ? mapped : event))
      return mapped
    },
    // Elimina el evento del estado local después de que el backend confirme la operación.
    deleteEvent: async (slug, reason) => {
      const saved = await deleteEventRequest(slug, reason, session?.token)
      const mapped = saved ? fromApiEvent(saved) : null
      setEventList((current) => current.filter((event) => event.slug !== slug))
      return mapped
    },
    anniversaryList,
    // Crea una efeméride y la agrega a la lista local.
    submitAnniversary: async (proposal) => {
      const saved = await createAnniversary(toApiAnniversary(proposal), session?.token)
      const mapped = fromApiAnniversary(saved)
      setAnniversaryList((current) => [mapped, ...current.filter((item) => item.id !== mapped.id)])
      return mapped
    },
    // Actualiza el estado de moderación de una efeméride.
    updateAnniversary: async (id, updates) => {
      const saved = await updateAnniversaryStatus(id, {
        status: updates.status,
        review_note: updates.reviewNote || '',
      }, session?.token)
      const mapped = fromApiAnniversary(saved)
      setAnniversaryList((current) => current.map((item) => String(item.id) === String(id) ? mapped : item))
      return mapped
    },
    // Elimina la efeméride del estado local tras completar la petición.
    deleteAnniversary: async (id, reason) => {
      const saved = await deleteAnniversaryRequest(id, reason, session?.token)
      const mapped = saved ? fromApiAnniversary(saved) : null
      setAnniversaryList((current) => current.filter((item) => String(item.id) !== String(id)))
      return mapped
    },
  }), [role, organizerProfile, session, favoriteSlugs, eventList, anniversaryList, openDashboardPanels, resetDashboardPanels])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
