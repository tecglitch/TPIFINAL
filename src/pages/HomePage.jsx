import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import CategoryCard from '../components/CategoryCard'
import EventCard from '../components/EventCard'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import SectionTitle from '../components/SectionTitle'
import { useAppState } from '../AppStateContext'
import { categories } from '../data/events'
import heroImage from '../images/playita.png'

function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { role, logout, eventList, anniversaryList } = useAppState()
  const upcoming = eventList.filter((event) => ['published', 'rescheduled'].includes(event.status) && new Date(event.endAt || event.startAt) >= new Date()).sort((a, b) => new Date(a.startAt) - new Date(b.startAt)).slice(0, 3)
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

  return (
    <div>
      <Navbar brand={<><span className="text-primary">Agenda</span> Ciudad</>} links={links} action={role === 'visitor'
        ? <Link to="/acceso"><Button variant="outline" className="hidden sm:inline-flex">Ingresar</Button></Link>
        : <Button variant="outline" className="hidden sm:inline-flex" onClick={logout}>Cerrar sesión</Button>} />
      <main>
        <Hero backgroundImage={heroImage} eyebrow="Todo lo que pasa, en un solo lugar" title="Descubrí los próximos eventos de Goya, Corrientes" description="Encontrá actividades, cultura y encuentros para compartir con tu comunidad." actions={<>
          <Link to="/calendario"><Button className="border-0 bg-white text-primary hover:bg-white/90">Explorar eventos</Button></Link>
          <Link to="/acceso"><Button variant="ghost" className="text-primary-content hover:bg-white/15">¿Organizás eventos? Ingresá</Button></Link>
        </>} />
        <div className="relative z-10 px-4">
          <form onSubmit={search} className="card mx-auto -mt-8 max-w-4xl bg-base-100 p-4 shadow-lg md:p-5">
            <label className="input input-bordered flex items-center gap-2">
              <span aria-hidden="true">⌕</span><input className="grow" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar eventos, lugares, categorías u organizaciones" />
            </label>
          </form>
        </div>
        <section className="font-note-hand mx-auto max-w-6xl px-6 py-12">
          <SectionTitle eyebrow="Memoria local" title="Un día como hoy…" />
          {anniversary ? <article className="grid overflow-hidden rounded-box bg-base-100 shadow-sm md:grid-cols-[1fr_1.4fr]">
            <img className="h-52 w-full object-cover md:h-full" src={anniversary.image} alt="" />
            <div className="p-6 md:p-8"><p className="text-sm font-bold text-primary">Efeméride · {today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p><h3 className="mt-2 text-2xl font-black">{anniversary.title}</h3><p className="mt-3 text-base-content/75">{anniversary.description}</p><p className="mt-4 text-sm">Propuesta de {anniversary.organization}</p></div>
          </article> : <p className="rounded-box bg-base-100 p-5 text-base-content/70">Hoy no hay una efeméride publicada. Las organizaciones pueden iniciar sesión para proponer una.</p>}
        </section>
        <section id="eventos" className="mx-auto max-w-6xl px-6 pb-16">
          <SectionTitle eyebrow="Agenda local" title="Próximos eventos" action={<Link to="/calendario"><Button variant="outline">Ver calendario completo</Button></Link>} />
          {upcoming.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{upcoming.map((event) => <EventCard key={event.slug} event={event} />)}</div> : <p className="rounded-box bg-base-100 p-6">Todavía no hay próximos eventos publicados.</p>}
        </section>
        <section id="categorias" className="bg-base-200 px-6 py-16">
          <div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Explorá" title="Encontrá algo para vos" /><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{categories.map((category) => <CategoryCard key={category.name} {...category} countLabel="eventos" />)}</div></div>
        </section>
      </main>
      <Footer id="contacto"><aside><p className="text-lg font-bold">Agenda Ciudad</p><p>Una agenda hecha por y para la comunidad.</p><p>© 2026 Agenda Ciudad</p></aside></Footer>
    </div>
  )
}

export default HomePage
