import { statusLabels } from '../data/events'

const tones = {
  published: 'badge-success', pending: 'badge-warning', changes_requested: 'badge-info',
  rejected: 'badge-error', suspended: 'badge-warning', rescheduled: 'badge-info',
  cancelled: 'badge-error', past: 'badge-ghost',
}

// Traduce el estado de un registro a una etiqueta con color y texto legible.
function StatusBadge({ status }) {
  if (!status) return null
  return <span className={`badge ${tones[status] || 'badge-ghost'}`}>{statusLabels[status] || status}</span>
}

export default StatusBadge
