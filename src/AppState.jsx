import { useEffect, useMemo, useState } from 'react'
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
  updateEventStatus,
} from './api'
import { StateContext } from './AppStateContext'

const FAVORITES_KEY = 'agenda-goya:favorites:v1'
const SESSION_KEY = 'agenda-goya:session:v1'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((slug) => typeof slug === 'string') : []
  } catch {
    return []
  }
}

function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return saved?.token && saved?.user ? saved : null
  } catch {
    return null
  }
}

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

function toApiEvent(event) {
  return {
    slug: event.slug,
    title: event.title,
    category: event.category,
    description: event.description,
    image: event.image || null,
    start_at: event.startAt,
    end_at: event.endAt,
    location: event.location,
    city: event.city,
    organization: event.organization,
    ticket_type: event.ticketType,
    price: event.price || null,
    ticket_url: event.ticketUrl || null,
  }
}

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

export function AppStateProvider({ children }) {
  const [session, setSession] = useState(readSession)
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
    login: setSession,
    logout: () => {
      setSession(null)
      setFavoriteSlugs(readFavorites())
    },
    favoriteSlugs,
    toggleFavorite: async (slug) => {
      const isSaved = favoriteSlugs.includes(slug)
      setFavoriteSlugs((current) => isSaved
        ? current.filter((item) => item !== slug)
        : [...current, slug])
      if (!session?.token) return
      try {
        if (isSaved) await removeFavoriteRequest(slug, session.token)
        else await addFavoriteRequest(slug, session.token)
      } catch (error) {
        setFavoriteSlugs((current) => isSaved
          ? [...current, slug]
          : current.filter((item) => item !== slug))
        if (error.status === 401) setSession(null)
      }
    },
    eventList,
    submitEvent: async (proposal) => {
      const saved = await createEvent(toApiEvent(proposal), session?.token)
      const mapped = fromApiEvent(saved)
      setEventList((current) => [mapped, ...current.filter((event) => event.slug !== mapped.slug)])
      return mapped
    },
    updateEvent: async (slug, updates) => {
      const saved = await updateEventStatus(slug, {
        status: updates.status,
        review_note: updates.reviewNote || '',
        start_at: updates.startAt,
        end_at: updates.endAt,
      }, session?.token)
      const mapped = fromApiEvent(saved)
      setEventList((current) => current.map((event) => event.slug === slug ? mapped : event))
      return mapped
    },
    deleteEvent: async (slug, reason) => {
      const saved = await deleteEventRequest(slug, reason, session?.token)
      const mapped = saved ? fromApiEvent(saved) : null
      setEventList((current) => current.filter((event) => event.slug !== slug))
      return mapped
    },
    anniversaryList,
    submitAnniversary: async (proposal) => {
      const saved = await createAnniversary(proposal, session?.token)
      const mapped = fromApiAnniversary(saved)
      setAnniversaryList((current) => [mapped, ...current.filter((item) => item.id !== mapped.id)])
      return mapped
    },
    updateAnniversary: async (id, updates) => {
      const saved = await updateAnniversaryStatus(id, {
        status: updates.status,
        review_note: updates.reviewNote || '',
      }, session?.token)
      const mapped = fromApiAnniversary(saved)
      setAnniversaryList((current) => current.map((item) => String(item.id) === String(id) ? mapped : item))
      return mapped
    },
    deleteAnniversary: async (id, reason) => {
      const saved = await deleteAnniversaryRequest(id, reason, session?.token)
      const mapped = saved ? fromApiAnniversary(saved) : null
      setAnniversaryList((current) => current.filter((item) => String(item.id) !== String(id)))
      return mapped
    },
  }), [role, organizerProfile, session, favoriteSlugs, eventList, anniversaryList])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
