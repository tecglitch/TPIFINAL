import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EventCard from '../components/EventCard'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { isPublicEvent } from '../data/events'

function FavoritesPage() {
  const { eventList, favoriteSlugs, toggleFavorite } = useAppState()
  const saved = eventList.filter((event) => isPublicEvent(event) && favoriteSlugs.includes(event.slug))
  const missing = favoriteSlugs.filter((slug) => !eventList.some((event) => event.slug === slug && isPublicEvent(event)))
  return (
    <PageLayout><section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <SectionTitle eyebrow="Tu selección" title="Mis eventos guardados" />
      <p className="mb-6 rounded-box bg-info/10 p-4 text-sm">Los favoritos se guardan únicamente en este navegador. No se sincronizan con una cuenta.</p>
      {saved.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{saved.map((event) => <EventCard key={event.slug} event={event} />)}</div> : <div className="rounded-box bg-base-100 p-8 text-center"><h2 className="text-xl font-bold">Todavía no guardaste eventos</h2><p className="mt-2 text-base-content/70">Usá “Guardar” en cualquier evento para encontrarlo acá.</p><Link to="/calendario"><Button className="mt-5">Explorar el calendario</Button></Link></div>}
      {missing.length > 0 && <div className="mt-8 rounded-box border border-warning/40 bg-base-100 p-5"><h2 className="font-bold">Favoritos no disponibles en la agenda</h2><p className="mt-1 text-sm text-base-content/70">Hay {missing.length} favorito(s) que se quitaron de la agenda o pasaron a revisión privada.</p><Button className="mt-3" variant="outline" onClick={() => missing.forEach(toggleFavorite)}>Quitar los no disponibles</Button></div>}
    </section></PageLayout>
  )
}

export default FavoritesPage
