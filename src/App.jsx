import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './AppState'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import EventDetailsPage from './pages/EventDetailsPage'
import CreateEventPage from './pages/CreateEventPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'
import OrganizerAccessPage from './pages/OrganizerAccessPage'
import OrganizerRegisterPage from './pages/OrganizerRegisterPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AnniversaryProposalPage from './pages/AnniversaryProposalPage'

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/eventos/:slug" element={<EventDetailsPage />} />
          <Route path="/crear" element={<CreateEventPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/guardados" element={<FavoritesPage />} />
          <Route path="/acceso" element={<OrganizerAccessPage />} />
          <Route path="/registro" element={<OrganizerRegisterPage />} />
          <Route path="/organizador" element={<OrganizerDashboardPage />} />
          <Route path="/administracion" element={<AdminDashboardPage />} />
          <Route path="/efemerides/proponer" element={<AnniversaryProposalPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
