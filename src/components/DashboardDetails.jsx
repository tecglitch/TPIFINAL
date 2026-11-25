import { getLocalDateTime } from '../data/events'

export function DashboardDetails({ item, fields, children }) {
  return (
    <div className="grid gap-4">
      {item.image && <img src={item.image} alt={`Imagen de ${item.title}`} loading="lazy" className="max-h-72 w-full rounded-box bg-base-200 object-contain" />}
      <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{item.description}</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {fields.filter(([, value]) => value).map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-box bg-base-200/70 p-3">
            <dt className="font-semibold text-base-content/70">{label}</dt>
            <dd className="mt-1 [overflow-wrap:anywhere]">{value}</dd>
          </div>
        ))}
      </dl>
      {item.reviewNote && <p className="rounded-box bg-warning/15 p-3 text-sm"><strong>Motivo anterior</strong> · {item.reviewNote}</p>}
      {children}
    </div>
  )
}

export function DashboardEventDetails({ event, children }) {
  const paid = event.ticketType === 'paid'
  const fields = [
    ['Categoría', event.category],
    ['Inicio', event.startAt && getLocalDateTime(event.startAt)],
    ['Fin', event.endAt && getLocalDateTime(event.endAt)],
    ['Inicio anterior', event.previousStartAt && getLocalDateTime(event.previousStartAt)],
    ['Fin anterior', event.previousEndAt && getLocalDateTime(event.previousEndAt)],
    ['Lugar', event.location],
    ['Ciudad', event.city],
    ['Organización', event.organization],
    ['Organizador', event.organizer?.name],
    ['Correo', event.organizer?.email],
    ['Teléfono', event.organizer?.phone],
    ['Entrada', paid ? 'Paga' : 'Gratuita'],
    ['Precio', paid && event.price],
  ]

  return (
    <DashboardDetails item={event} fields={fields}>
      {paid && event.ticketUrl && <a className="link link-primary w-fit text-sm" href={event.ticketUrl} target="_blank" rel="noreferrer">Ver enlace de entradas</a>}
      {children}
    </DashboardDetails>
  )
}
