import { createContext, useContext } from 'react'

// Comparte el estado global entre componentes sin pasar props manualmente.
export const StateContext = createContext(null)

// Accede al contexto y falla explícitamente si se usa fuera del proveedor.
export function useAppState() {
  const value = useContext(StateContext)
  if (!value) throw new Error('useAppState debe usarse dentro de AppStateProvider')
  return value
}
