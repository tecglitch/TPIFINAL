import Button from './Button'
import Footer from './Footer'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { useAppState } from '../AppStateContext'

function PageLayout({ children }) {
  const { role } = useAppState()
  const links = [
    { to: '/calendario', label: 'Calendario' },
    { to: '/guardados', label: 'Mis eventos guardados' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/acceso', label: 'Acceso organizador' },
    { to: '/registro', label: 'Registro' },
  ]
  if (role === 'organizer') links.splice(2, 0,
    { to: '/crear', label: 'Proponer evento' },
    { to: '/efemerides/proponer', label: 'Proponer efeméride' },
    { to: '/organizador', label: 'Panel organizador (demo)' },
  )
  if (role === 'admin') links.splice(2, 0, { to: '/administracion', label: 'Administración (demo)' })

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar
        brand={<><span className="text-primary">Agenda</span> Ciudad</>}
        brandHref="/"
        links={links}
        action={<div className="flex items-center gap-2"><span className="hidden text-xs text-base-content/60 md:inline">Demo: {role === 'visitor' ? 'visitante' : role === 'organizer' ? 'organizador' : 'administrador'}</span><Link to="/acceso"><Button variant="outline" className="hidden sm:inline-flex">Acceso demo</Button></Link></div>}
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
