import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import CategoryCard from '../components/CategoryCard'
import CalendarButton from '../components/CalendarButton'
import EventCard from '../components/EventCard'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import SectionTitle from '../components/SectionTitle'
import CornerFoliage from '../components/CornerFoliage'
import WoodFrameFoliage from '../components/WoodFrameFoliage'
import { useAppState } from '../AppStateContext'
import { categories, isPublicEvent } from '../data/events'
import heroImage from '../images/playita.png'
import woodTexture from '../images/dark-wood-planks.png'

function HomePage() {
  const [query, setQuery] = useState('')
  const eventScrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const navigate = useNavigate()
  const { role, session, logout, eventList, anniversaryList } = useAppState()
  const countableEvents = eventList.filter((event) => isPublicEvent(event) || (role === 'admin' && ['deleted', 'cancelled'].includes(event.status)))
  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }
  const upcoming = eventList.filter((event) => ['published', 'rescheduled'].includes(event.status) && new Date(event.endAt || event.startAt) >= new Date()).sort((a, b) => new Date(a.startAt) - new Date(b.startAt)).slice(0, 9)
  useEffect(() => {
    const viewport = eventScrollRef.current
    if (!viewport) return undefined
    const updateArrows = () => {
      setCanScrollLeft(viewport.scrollLeft > 1)
      setCanScrollRight(viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1)
    }
    updateArrows()
    viewport.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      viewport.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [upcoming.length])

  function scrollEvents(direction) {
    eventScrollRef.current?.scrollBy({ left: direction * eventScrollRef.current.clientWidth, behavior: 'smooth' })
  }
  const today = new Date()
  const anniversary = anniversaryList.find((item) => item.status === 'published' && item.month === today.getMonth() + 1 && item.day === today.getDate())

  function search(event) {
    event.preventDefault()
    navigate(`/calendario?q=${encodeURIComponent(query)}`)
  }

  const links = [
    { to: '/calendario', label: 'Calendario' },
    { to: '/guardados', label: 'Mis eventos guardados' },
    { to: '/contacto', label: 'Contacto' },
  ]
  if (role === 'organizer') links.push(
    { to: '/crear', label: 'Proponer evento' },
    { to: '/efemerides/proponer', label: 'Proponer efeméride' },
    { to: '/organizador', label: 'Panel organizador' },
  )
  if (role === 'admin') links.push({ to: '/administracion', label: 'Administración' })

  return (
    <div>
      <Navbar brand={<><span className="text-primary">Agenda</span> Ciudad</>} links={links} action={role === 'visitor'
        ? <Link to="/acceso"><Button variant="outline">Ingresar</Button></Link>
        : <div className="flex items-center gap-2"><span className="hidden text-right text-xs text-base-content/60 md:inline"><span className="block font-medium text-base-content">{session?.user?.email}</span><span className="block">{role === 'organizer' ? 'Organizador' : 'Administrador'}</span></span><Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button></div>} />
      <main className="home-main">
        <CornerFoliage />
        <Hero backgroundImage={heroImage} eyebrow="Todo lo que pasa, en un solo lugar" title="Descubrí los próximos eventos de Goya, Corrientes" description="Encontrá actividades, cultura y encuentros para compartir con tu comunidad." actions={<>
          <Link to="/calendario"><Button className="border-0 bg-white text-primary hover:bg-white/90">Explorar eventos</Button></Link>
        </>} />
        <div className="home-stage">
          <WoodFrameFoliage />
          <div className="wood-surface" style={{ backgroundImage: `url("${woodTexture}")` }}>
            <div className="relative z-10">
              <div className="relative z-10 px-4">
                <form onSubmit={search} className="card mx-auto -mt-8 max-w-4xl bg-base-100 p-4 shadow-lg md:p-5">
                  <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
                    <label className="input input-bordered flex min-w-0 grow items-center gap-2">
                      <span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar eventos, lugares, categorías u organizaciones" className="grow" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar eventos, lugares, categorías u organizaciones" />
                    </label>
                    <Button type="submit" className="shrink-0">Buscar</Button>
                  </div>
                </form>
              </div>
              <section className="mx-auto max-w-6xl px-6 py-12">
                <SectionTitle eyebrow="Memoria local" title="Un día como hoy…" className="wood-section-title" />
                {anniversary ?
                  <article className="relative z-30 grid h-[32rem] grid-rows-[13rem_1fr] overflow-hidden rounded-box bg-base-100 shadow-sm md:h-[19rem] md:grid-cols-[1fr_1.4fr] md:grid-rows-1">
                    <img className="h-full w-full object-cover" src={anniversary.image} alt="" />
                    <div className="flex min-h-0 flex-col p-5 md:p-8">
                      <p className="text-sm font-bold text-primary">Efeméride · {today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                      <h3 className="mt-2 line-clamp-2 text-2xl font-black">{anniversary.title}</h3>
                      <p className="anniversary-description mt-3 text-base-content/75">{anniversary.description}</p>
                      <p className="mt-auto pt-2 text-sm">Propuesta de {anniversary.organization}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link className="btn btn-outline btn-sm" to={`/efemerides/${encodeURIComponent(anniversary.id)}`}>Ver más detalles</Link>
                        <CalendarButton item={anniversary} className="btn-sm" />
                      </div>
                    </div>
                  </article>
                : <p className="rounded-box bg-base-100 p-5 text-base-content/70">Hoy no hay una efeméride publicada. Las organizaciones pueden iniciar sesión para proponer una.</p>}
              </section>
              <section id="eventos" className="mx-auto max-w-6xl px-6 pb-16">
                <SectionTitle eyebrow="Agenda local" title="Próximos eventos" className="wood-section-title" action={<Link to="/calendario"><Button variant="outline" className="border-amber-100 text-amber-50 hover:bg-white/10">Ver calendario completo</Button></Link>} />
                {upcoming.length ? <div className="home-event-carousel"><button type="button" className="home-carousel-arrow" aria-label="Ver eventos anteriores" onClick={() => scrollEvents(-1)} disabled={!canScrollLeft}>&lsaquo;</button><div ref={eventScrollRef} className="home-event-scroll"><div className="home-event-track">{upcoming.map((event) => <EventCard key={event.slug} event={event} className="event-paper" />)}</div></div><button type="button" className="home-carousel-arrow" aria-label="Ver mas eventos" onClick={() => scrollEvents(1)} disabled={!canScrollRight}>&rsaquo;</button></div> : <p className="rounded-box bg-base-100 p-6">Todavía no hay próximos eventos publicados.</p>}
              </section>
              <section id="categorias" className="px-6 py-16">
                <div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Explorá" title="Encontrá algo para vos" className="wood-section-title font-note-hand" /><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{categories.map((category) => <CategoryCard key={category.name} {...category} count={countableEvents.filter((event) => event.category === category.name).length} countLabel="eventos" to={`/calendario?category=${encodeURIComponent(category.name)}`} />)}</div></div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer id="contacto"><aside><p className="text-lg font-bold">Agenda Ciudad</p><p>Una agenda hecha por y para la comunidad. ♥</p><p>© 2026 Agenda Ciudad</p></aside></Footer>
    </div>
  )
}

export default HomePage
