import Button from './Button'
import Footer from './Footer'
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../AppStateContext'

// Estructura común de página y navegación según el rol de la sesión.
function PageLayout({ children }) {
  const { role, session, logout } = useAppState()
  const navigate = useNavigate()
  // Cierra la sesión y vuelve al inicio reemplazando la entrada de historial.
  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }
  const links = [
    { to: '/calendario', label: 'Calendario' },
    { to: '/guardados', label: 'Mis eventos guardados' },
    { to: '/contacto', label: 'Contacto' },
  ]
  if (role === 'organizer') links.splice(2, 0,
    { to: '/crear', label: 'Proponer evento' },
    { to: '/efemerides/proponer', label: 'Proponer efeméride' },
    { to: '/organizador', label: 'Panel organizador' },
  )
  if (role === 'admin') links.splice(2, 0,
    { to: '/administracion', label: 'Administración' },
    { to: '/administracion/consultas', label: 'Consultas' },
  )

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar
        brand={<><span className="text-primary">Agenda</span> Ciudad</>}
        brandHref="/"
        links={links}
        action={<div className="flex items-center gap-2"><span className="hidden text-right text-xs text-base-content/60 md:inline">{session?.user?.email && <span className="block font-medium text-base-content">{session.user.email}</span>}<span className="block">{role === 'visitor' ? 'Visitante' : role === 'organizer' ? 'Organizador' : 'Administrador'}</span></span>{role === 'visitor' ? <Link to="/acceso"><Button variant="outline">Ingresar</Button></Link> : <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>}</div>}
      />
      <main>{children}</main>
      <Footer id="pie">
        <aside>
          <p className="text-lg font-bold">Agenda Ciudad</p>
          <p>Una agenda hecha por y para la comunidad. ♥</p>
          <p>© 2026 Agenda Ciudad</p>
        </aside>
      </Footer>
    </div>
  )
}

export default PageLayout
