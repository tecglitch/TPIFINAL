import { createContext, useContext } from 'react'

export const StateContext = createContext(null)

export function useAppState() {
  const value = useContext(StateContext)
  if (!value) throw new Error('useAppState debe usarse dentro de AppStateProvider')
  return value
}
