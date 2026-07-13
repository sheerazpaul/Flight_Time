import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import FlightDetailPage from './pages/FlightDetailPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import { Toaster } from './components/ui/Toaster'

function App() {
  const location = useLocation()

  return (
    <div className="app-wrapper">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/flight/:id" element={<FlightDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </div>
  )
}

export default App
