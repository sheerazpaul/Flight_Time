import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, Plane, Download, Home, Mail } from 'lucide-react'
import { clearBooking } from '../store/bookingSlice'
import PageTransition from '../components/PageTransition'
import { format } from 'date-fns'

// Confetti-like particles
function Particles() {
  const colors = ['#6366f1', '#8b5cf6', '#0891b2', '#059669', '#d97706']
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { bookingReference, selectedFlight, passengerDetails, selectedClass } = useSelector((s) => s.booking)

  const ref = bookingReference || 'SKYVOY1'
  const flight = selectedFlight || { airline: 'Emirates', flightCode: 'EK203', fromCode: 'JFK', toCode: 'DXB', departure: '08:00', arrival: '16:30' }
  const passenger = passengerDetails || { firstName: 'Traveler', lastName: '' }
  const cls = selectedClass || 'Economy'

  const handleNewSearch = () => {
    dispatch(clearBooking())
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="confirmation-page">
        <Particles />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="confirmation-card"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Success Icon */}
            <motion.div
              className="success-icon"
              variants={fadeUp}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <CheckCircle size={48} />
            </motion.div>

            <motion.h1 className="confirmation-title" variants={fadeUp}>
              Booking <span className="text-gradient">Confirmed!</span>
            </motion.h1>

            <motion.p className="confirmation-subtitle" variants={fadeUp}>
              Congratulations, <strong>{passenger.firstName} {passenger.lastName}</strong>! Your flight has been booked
              successfully. A confirmation has been sent to{' '}
              {passenger.email ? <strong>{passenger.email}</strong> : 'your email'}.
            </motion.p>

            {/* Booking Reference */}
            <motion.div className="booking-ref" variants={fadeUp}>
              <div className="booking-ref-label">Booking Reference</div>
              <div className="booking-ref-code">{ref}</div>
            </motion.div>

            {/* Flight Summary */}
            <motion.div
              variants={fadeUp}
              style={{
                background: 'rgba(99,102,241,0.04)',
                border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                marginBottom: 32,
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Flight Details</div>
                <span className="badge badge-primary">{cls.replace('_', ' ')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }} className="text-gradient">
                    {flight.fromCode}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{flight.departure}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 6 }}>
                    {flight.airline} · {flight.flightCode}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--gradient-primary)' }} />
                    <Plane size={16} color="var(--primary-light)" />
                    <div style={{ flex: 1, height: 1, background: 'var(--gradient-primary)' }} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 6 }}>Direct</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }} className="text-gradient">
                    {flight.toCode}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{flight.arrival}</div>
                </div>
              </div>
            </motion.div>

            {/* What's next */}
            <motion.div variants={fadeUp} style={{ marginBottom: 32, textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                What happens next?
              </div>
              {[
                { emoji: '📧', text: 'Confirmation email sent to your inbox' },
                { emoji: '🎫', text: 'E-ticket will be issued within 15 minutes' },
                { emoji: '🛂', text: 'Check-in opens 24 hours before departure' },
                { emoji: '🧳', text: 'Arrive at airport 2–3 hours early' },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                  whileHover={{ x: 4, color: 'var(--text-primary)' }}
                >
                  <span>{item.emoji}</span>
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div className="conf-actions" variants={fadeUp}>
              <motion.button
                className="conf-btn-primary"
                onClick={handleNewSearch}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Home size={16} />
                Book Another Flight
              </motion.button>
              <motion.button
                className="conf-btn-secondary"
                onClick={() => window.print()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} />
                Download Ticket
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
