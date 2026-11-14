import { useEffect, useMemo, useState } from 'react'
import { anniversaries as initialAnniversaries, events as initialEvents } from './data/events'
import { StateContext } from './AppStateContext'

const FAVORITES_KEY = 'agenda-goya:favorites:v1'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((slug) => typeof slug === 'string') : []
  } catch {
    return []
  }
}

export function AppStateProvider({ children }) {
  // Los roles son solo una selección temporal de demostración; protegerlos de verdad requiere backend.
  const [role, setRole] = useState('visitor')
  const [organizerProfile, setOrganizerProfile] = useState({
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '+54 3777 555 010',
    organization: 'Feria Goya',
  })
  const [favoriteSlugs, setFavoriteSlugs] = useState(readFavorites)
  const [eventList, setEventList] = useState(initialEvents)
  const [anniversaryList, setAnniversaryList] = useState(initialAnniversaries)

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteSlugs))
  }, [favoriteSlugs])

  const value = useMemo(() => ({
    role,
    setRole,
    organizerProfile,
    setOrganizerProfile,
    favoriteSlugs,
    toggleFavorite: (slug) => setFavoriteSlugs((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug]),
    eventList,
    submitEvent: (proposal) => setEventList((current) => [{ ...proposal, organizer: organizerProfile, slug: proposal.slug || `propuesta-${Date.now()}`, status: 'pending', submittedAt: new Date().toISOString().slice(0, 10) }, ...current]),
    updateEvent: (slug, updates) => setEventList((current) => current.map((event) => event.slug === slug ? { ...event, ...updates } : event)),
    anniversaryList,
    submitAnniversary: (proposal) => setAnniversaryList((current) => [{ ...proposal, organizer: organizerProfile, id: `efemeride-${Date.now()}`, status: 'pending', submittedAt: new Date().toISOString().slice(0, 10) }, ...current]),
    updateAnniversary: (id, updates) => setAnniversaryList((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item)),
  }), [role, organizerProfile, favoriteSlugs, eventList, anniversaryList])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
