import { useAppState } from '../AppStateContext'

function FavoriteButton({ slug, className = '' }) {
  const { favoriteSlugs, toggleFavorite } = useAppState()
  const saved = favoriteSlugs.includes(slug)
  return (
    <button
      type="button"
      className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-outline'} ${className}`}
      onClick={() => toggleFavorite(slug)}
      aria-pressed={saved}
      aria-label={saved ? 'Quitar de mis eventos guardados' : 'Guardar en mis eventos'}
    >
      {saved ? '♥ Guardado' : '♡ Guardar'}
    </button>
  )
}

export default FavoriteButton
