import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Flights' },
  ]

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <motion.div
            className="nav-logo-icon"
            whileHover={{ scale: 1.1, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Plane size={20} color="white" />
          </motion.div>
          <span>SkyVoyage</span>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" className="nav-cta">Book Now</Link>
            </motion.div>
          </li>
        </ul>
      </div>
    </motion.nav>
  )
}
