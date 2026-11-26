import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppStateProvider } from './AppState'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import EventDetailsPage from './pages/EventDetailsPage'
import EventStatusPage from './pages/EventStatusPage'
import CreateEventPage from './pages/CreateEventPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'
import OrganizerAccessPage from './pages/OrganizerAccessPage'
import OrganizerRegisterPage from './pages/OrganizerRegisterPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ContactMessagesPage from './pages/ContactMessagesPage'
import AnniversaryProposalPage from './pages/AnniversaryProposalPage'
import AnniversaryDetailsPage from './pages/AnniversaryDetailsPage'

// Reinicia el scroll al cambiar de página.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Declara las páginas disponibles y comparte el estado global de la aplicación.
function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/eventos/:slug" element={<EventDetailsPage />} />
          <Route path="/eventos/:slug/estado" element={<EventStatusPage />} />
          <Route path="/eventos/:slug/editar" element={<CreateEventPage />} />
          <Route path="/crear" element={<CreateEventPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/guardados" element={<FavoritesPage />} />
          <Route path="/acceso" element={<OrganizerAccessPage />} />
          <Route path="/registro" element={<OrganizerRegisterPage />} />
          <Route path="/organizador" element={<OrganizerDashboardPage />} />
          <Route path="/administracion" element={<AdminDashboardPage />} />
          <Route path="/administracion/consultas" element={<ContactMessagesPage />} />
          <Route path="/efemerides/proponer" element={<AnniversaryProposalPage />} />
          <Route path="/efemerides/:id" element={<AnniversaryDetailsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
