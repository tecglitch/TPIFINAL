import Button from './Button'
import { Link } from 'react-router-dom'

function Navbar({ brand, brandHref = '/', links = [], menuLabel = 'Abrir menú', action }) {
  const renderLink = (link) => {
    const content = link.to
      ? <Link to={link.to}>{link.label}</Link>
      : <a href={link.href}>{link.label}</a>

    return <li key={link.label}>{content}</li>
  }

  return (
    <header className="navbar bg-base-100/95 px-4 shadow-sm backdrop-blur md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <Button variant="ghost" className="btn-circle lg:hidden" aria-label={menuLabel}>
            ☰
          </Button>
          <ul className="menu dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            {links.map(renderLink)}
          </ul>
        </div>
        <Link className="btn btn-ghost text-xl font-black tracking-tight" to={brandHref}>
          {brand}
        </Link>
      </div>
      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1">
          {links.map(renderLink)}
        </ul>
      </nav>
      {action && <div className="navbar-end">{action}</div>}
    </header>
  )
}

export default Navbar
