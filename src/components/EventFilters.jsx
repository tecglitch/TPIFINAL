import Button from './Button'

function EventFilters({ filters, onChange, onClear, categories }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value })
  return (
    <div className="mb-6 rounded-box bg-base-100 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Buscar evento</span>
          <input className="input input-bordered w-full" type="search" value={filters.query} onChange={set('query')} placeholder="Nombre, lugar, ciudad u organización" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Categoría</span>
          <select className="select select-bordered w-full" value={filters.category} onChange={set('category')}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Tipo de entrada</span>
          <select className="select select-bordered w-full" value={filters.ticketType} onChange={set('ticketType')}>
            <option value="">Todos los tipos</option><option value="free">Gratuita</option><option value="paid">Paga</option>
          </select>
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Estado</span>
          <select className="select select-bordered w-full" value={filters.status} onChange={set('status')}>
            <option value="">Todos los estados públicos</option>
            <option value="published">Publicado</option><option value="suspended">Suspendido</option><option value="rescheduled">Reprogramado</option>
            <option value="cancelled">Cancelado</option><option value="past">Pasado</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex justify-end"><Button type="button" variant="outline" onClick={onClear}>Limpiar filtros</Button></div>
    </div>
  )
}

export default EventFilters
