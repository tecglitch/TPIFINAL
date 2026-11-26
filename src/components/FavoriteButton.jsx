import { useRef, useState } from 'react'
import { useAppState } from '../AppStateContext'
import { canSubscribeToEventAlerts } from '../data/events'
import EventAlertDialog from './EventAlertDialog'

// Muestra y alterna el estado guardado de un evento.
function FavoriteButton({ event, className = '' }) {
  const { favoriteSlugs, toggleFavorite } = useAppState()
  const { slug } = event
  const saved = favoriteSlugs.includes(slug)
  const buttonRef = useRef(null)
  const dialogRef = useRef(null)
  const [saving, setSaving] = useState(false)

  async function handleClick() {
    if (saving) return
    setSaving(true)
    try {
      const updated = await toggleFavorite(slug)
      if (updated && !saved) dialogRef.current?.showModal()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-outline'} ${className}`}
        onClick={handleClick}
        disabled={saving}
        aria-pressed={saved}
        aria-label={saved ? 'Quitar de mis eventos guardados' : 'Guardar en mis eventos'}
      >
        {saved ? '♥ Guardado' : '♡ Guardar'}
      </button>
      {canSubscribeToEventAlerts(event) && (
        <EventAlertDialog
          dialogRef={dialogRef}
          slug={slug}
          title="Avisos del evento"
          onClose={() => buttonRef.current?.focus()}
        />
      )}
    </>
  )
}

export default FavoriteButton
