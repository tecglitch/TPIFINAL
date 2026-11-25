import { Link } from 'react-router-dom'

// Muestra una categoría y enlaza al calendario con el filtro correspondiente.
function CategoryCard({ icon, name, count, countLabel = '', className = '', to }) {
  return (
    <Link to={to} className={`card items-center bg-base-100 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}>
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-2xl">{icon}</div>
      <h3 className="mt-3 font-bold">{name}</h3>
      {count !== undefined && <p className="text-sm text-base-content/60">{count} {countLabel}</p>}
    </Link>
  )
}

export default CategoryCard
