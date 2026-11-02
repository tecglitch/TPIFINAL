import Button from './Button'
import Footer from './Footer'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function PageLayout({ children }) {
  const links = [
    { to: '/calendario', label: 'Calendario' },
    { to: '/crear', label: 'Crear evento' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar
        brand={<><span className="text-primary">Agenda</span> Ciudad</>}
        brandHref="/"
        links={links}
        action={<Link to="/crear"><Button variant="outline" className="hidden sm:inline-flex">Crear evento</Button></Link>}
      />
      <main>{children}</main>
      <Footer id="pie">
        <aside>
          <p className="text-lg font-bold">Agenda Ciudad</p>
          <p>Una agenda hecha por y para la comunidad.</p>
          <p>© 2026 Agenda Ciudad</p>
        </aside>
      </Footer>
    </div>
  )
}

export default PageLayout
