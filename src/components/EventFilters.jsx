import { useRef, useState } from 'react'
import Button from './Button'

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const quickRanges = [
  { value: 'today', label: 'Hoy' },
  { value: 'weekend', label: 'Este fin de semana' },
  { value: 'next7', label: 'Próximos 7 días' },
  { value: 'thisMonth', label: 'Este mes' },
]

// Produce una clave de fecha local con formato AAAA-MM-DD.
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Convierte una fecha ISO al formato visible DD/MM/AAAA.
function formatDateForDisplay(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

// Agrega separadores mientras el usuario escribe los dígitos de la fecha.
function formatPartialDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

// Valida una fecha DD/MM/AAAA y devuelve su formato ISO o una cadena vacía.
function parseDisplayDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ''
  const [, dayText, monthText, yearText] = match
  const day = Number(dayText)
  const month = Number(monthText)
  const year = Number(yearText)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return ''
  return `${yearText}-${monthText}-${dayText}`
}

// Genera los botones de acceso rápido para hoy y los próximos seis días.
function upcomingDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const weekday = date.toLocaleDateString('es-AR', { weekday: 'long' })
    const label = index === 0 ? 'Hoy' : `${weekday[0].toLocaleUpperCase('es-AR')}${weekday.slice(1)}`
    return { value: dateKey(date), label, dateLabel: date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) }
  })
}

// Presenta controles de búsqueda y filtros de texto, fecha y categoría.
function EventFilters({ filters, onChange, onClear, categories, years }) {
  const datePickerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value })
  const selectDay = (date) => onChange({ ...filters, date, dateText: formatDateForDisplay(date), quickRange: '', month: '', year: '' })
  const selectQuickRange = (quickRange) => onChange({ ...filters, quickRange, date: '', dateText: '', month: '', year: '' })
  const selectMonthOrYear = (key) => (event) => onChange({
    ...filters,
    [key]: event.target.value,
    date: '',
    dateText: '',
    quickRange: '',
  })
  const handleDateTextChange = (event) => {
    const dateText = formatPartialDate(event.target.value)
    onChange({
      ...filters,
      dateText,
      date: parseDisplayDate(dateText),
      quickRange: '',
      month: '',
      year: '',
    })
  }
  const openDatePicker = () => {
    try {
      if (datePickerRef.current?.showPicker) datePickerRef.current.showPicker()
      else datePickerRef.current?.click()
    } catch {
      datePickerRef.current?.focus()
      datePickerRef.current?.click()
    }
  }
  const invalidDate = filters.dateText?.length === 10 && !parseDisplayDate(filters.dateText)
  const activeFilterCount = [
    filters.query,
    filters.organizer,
    filters.category,
    filters.ticketType,
    filters.status,
    filters.month,
    filters.year,
    filters.date,
    filters.quickRange,
    filters.multiDayOnly,
  ].filter(Boolean).length

  return (
    <div className="mb-6 rounded-box bg-base-100 p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Filtrar eventos</p>
          {activeFilterCount > 0 && <p className="mt-1 text-sm text-base-content/65">{activeFilterCount} {activeFilterCount === 1 ? 'filtro activo' : 'filtros activos'}</p>}
        </div>
        <Button type="button" variant="outline" aria-expanded={isOpen} aria-controls="event-filters-panel" onClick={() => setIsOpen((current) => !current)}>
          {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </Button>
      </div>

      <div
        id="event-filters-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'mt-5 grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'}`}
      >
        <div className="min-h-0 overflow-hidden border-t border-base-300">
          <div className="pt-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Buscar evento</span>
          <input className="input input-bordered w-full" type="search" value={filters.query} onChange={set('query')} placeholder="Nombre, lugar o ciudad" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Organizador u organización</span>
          <input className="input input-bordered w-full" type="search" value={filters.organizer} onChange={set('organizer')} placeholder="Ej. Municipalidad de Goya" />
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
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Mes</span>
          <select className="select select-bordered w-full" value={filters.month} onChange={selectMonthOrYear('month')}>
            <option value="">Todos los meses</option>
            {monthNames.map((month, index) => <option key={month} value={String(index + 1)}>{month}</option>)}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Año</span>
          <select className="select select-bordered w-full" value={filters.year} onChange={selectMonthOrYear('year')}>
            <option value="">Todos los años</option>
            {years.map((year) => <option key={year} value={String(year)}>{year}</option>)}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-box border border-base-300 px-3 py-2">
          <input className="checkbox checkbox-primary" type="checkbox" checked={filters.multiDayOnly} onChange={(event) => onChange({ ...filters, multiDayOnly: event.target.checked })} />
          <span className="text-sm font-semibold">Eventos de más de un día</span>
        </label>
      </div>

      <div className="mt-5 border-t border-base-300 pt-4">
        <p className="mb-2 text-sm font-semibold">Accesos rápidos</p>
        <div className="flex flex-wrap gap-2">
          {quickRanges.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn btn-sm ${filters.quickRange === item.value ? 'btn-primary' : 'btn-outline'}`}
              aria-pressed={filters.quickRange === item.value}
              onClick={() => selectQuickRange(filters.quickRange === item.value ? '' : item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-end">
        <label className="form-control max-w-xs">
          <span className="label-text mb-1 font-semibold">Elegir un día</span>
          <div className="join w-full">
            <input
              className="input input-bordered join-item min-w-0 grow"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="DD/MM/AAAA"
              aria-label="Fecha en formato día, mes y año"
              aria-invalid={invalidDate}
              aria-describedby={invalidDate ? 'event-date-error' : undefined}
              value={filters.dateText || ''}
              onChange={handleDateTextChange}
            />
            <button className="btn btn-outline join-item" type="button" aria-label="Abrir calendario" onClick={openDatePicker}>▦</button>
            <input
              ref={datePickerRef}
              className="sr-only"
              type="date"
              lang="es-AR"
              tabIndex={-1}
              aria-hidden="true"
              value={filters.date}
              onChange={(event) => selectDay(event.target.value)}
            />
          </div>
          {invalidDate && <span id="event-date-error" className="mt-1 text-xs text-error">Ingresá una fecha válida con formato DD/MM/AAAA.</span>}
        </label>
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold">Próximos días</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {upcomingDays().map((day) => (
              <button
                key={day.value}
                type="button"
                className={`btn btn-sm shrink-0 ${filters.date === day.value ? 'btn-primary' : 'btn-outline'}`}
                aria-pressed={filters.date === day.value}
                onClick={() => selectDay(filters.date === day.value ? '' : day.value)}
              >
                <span>{day.label}</span><span className="text-xs opacity-70">{day.dateLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="outline" onClick={onClear}>Limpiar filtros</Button>
      </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventFilters
