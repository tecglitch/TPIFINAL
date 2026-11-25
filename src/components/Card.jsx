// Contenedor visual estándar para agrupar contenido en una tarjeta.
function Card({ children, className = '' }) {
  return (
    <article className={`card bg-base-100 shadow-sm ${className}`}>
      {children}
    </article>
  )
}

export default Card
