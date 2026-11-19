import { useEffect, useMemo, useState } from 'react'
import { anniversaries as initialAnniversaries, events as initialEvents } from './data/events'
import { createEvent, getEvents, updateEventStatus } from './api'
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

export function AppStateProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const [favoriteSlugs, setFavoriteSlugs] = useState(readFavorites)
  const [eventList, setEventList] = useState(initialEvents)
  const [anniversaryList, setAnniversaryList] = useState(initialAnniversaries)

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteSlugs))
  }, [favoriteSlugs])

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  }, [session])

  useEffect(() => {
    getEvents(session?.token)
      .then((events) => {
        setEventList(events.map(fromApiEvent))
      })
      .catch((error) => {
        if (error.status === 401) setSession(null)
      })
  }, [session?.token])

  const role = session?.user?.role || 'visitor'
  const organizerProfile = session?.user || null

  const value = useMemo(() => ({
    role,
    organizerProfile,
    session,
    login: setSession,
    logout: () => setSession(null),
    favoriteSlugs,
    toggleFavorite: (slug) => setFavoriteSlugs((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug]),
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
    anniversaryList,
    submitAnniversary: (proposal) => setAnniversaryList((current) => [{
      ...proposal,
      organizer: organizerProfile,
      id: `efemeride-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10),
    }, ...current]),
    updateAnniversary: (id, updates) => setAnniversaryList((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item)),
  }), [role, organizerProfile, session, favoriteSlugs, eventList, anniversaryList])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
