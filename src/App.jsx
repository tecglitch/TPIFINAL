import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Button from './components/Button'
import CategoryCard from './components/CategoryCard'
import EventCard from './components/EventCard'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ContactPage from './pages/ContactPage'
import CreateEventPage from './pages/CreateEventPage'
import CalendarPage from './pages/CalendarPage'
import EventDetailsPage from './pages/EventDetailsPage'
import SearchBar from './components/SearchBar'
import SectionTitle from './components/SectionTitle'
import { categories, events } from './data/events'
import heroImage from './images/image.png'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/eventos/:slug" element={<EventDetailsPage />} />
        <Route path="/crear" element={<CreateEventPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function HomePage() {
  const links = [
    { to: '/calendario', label: 'Calendario' },
    { to: '/calendario', label: 'Crear evento' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <div>
      <Navbar
        brand={<><span className="text-primary">Agenda</span> Ciudad</>}
        links={links}
        action={<Link to="/crear"><Button variant="outline" className="hidden sm:inline-flex">Crear evento</Button></Link>}
      />
      <main>
        <Hero
          backgroundImage={heroImage}
          eyebrow="Todo lo que pasa, en un solo lugar"
          title="Descubrí los próximos eventos de Goya Corrientes"
          description="Encontrá actividades, cultura y encuentros para compartir con tu comunidad."
          actions={<>
            <Link to="/calendario"><Button className="border-0 bg-white text-primary hover:bg-white/90">Explorar eventos</Button></Link>
            <Link to="/crear"><Button variant="ghost" className="text-primary-content hover:bg-white/15">Publicar un evento</Button></Link>
          </>}
        />
        <div className="relative z-10 px-4">
          <SearchBar
            inputPlaceholder="Buscar eventos, lugares o categorías"
            options={[
              { value: '', label: 'Todas las categorías' },
              { value: 'cultura', label: 'Cultura' },
              { value: 'deportes', label: 'Deportes' },
              { value: 'gastronomia', label: 'Gastronomía' },
            ]}
            submitLabel="Buscar"
            onSubmit={(event) => event.preventDefault()}
          />
        </div>
        <section id="eventos" className="mx-auto max-w-6xl px-6 py-16">
          <SectionTitle eyebrow="Agenda local" title="Próximos eventos" action={<Link to="/calendario"><Button variant="outline">Ver calendario</Button></Link>} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => <EventCard key={event.slug} event={event} action={<Link to={`/eventos/${event.slug}`}><Button variant="ghost" className="text-primary">Ver más detalles</Button></Link>} />)}
          </div>
        </section>
        <section id="categorias" className="bg-base-200 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Explorá" title="Encontrá algo para vos" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.map((category) => <CategoryCard key={category.name} {...category} countLabel="eventos" />)}
            </div>
          </div>
        </section>
      </main>
      <Footer id="contacto">
        <aside>
          <p className="text-lg font-bold">Agenda Ciudad</p>
          <p>Una agenda hecha por y para la comunidad.</p>
          <p>© 2026 Agenda Ciudad</p>
        </aside>
      </Footer>
    </div>
  )
}

export default App
