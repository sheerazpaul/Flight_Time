import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Plane, Clock, Luggage, Wifi, Tv, Coffee, ChevronLeft, CheckCircle, Info } from 'lucide-react'
import { setSelectedClass } from '../store/bookingSlice'
import PageTransition from '../components/PageTransition'

const SEAT_CLASSES = [
  {
    id: 'Economy',
    name: 'Economy',
    emoji: '💺',
    multiplier: 1,
    features: ['Standard seat (29" pitch)', '1 carry-on bag', 'Meal on long-haul', 'In-seat power'],
    description: 'Comfortable and affordable for savvy travelers.',
  },
  {
    id: 'Premium_Economy',
    name: 'Premium Economy',
    emoji: '🛋️',
    multiplier: 1.5,
    features: ['Extra legroom (38" pitch)', '2 checked bags', 'Enhanced meals', 'Priority boarding', 'Extra recline'],
    description: 'The sweet spot between comfort and value.',
  },
  {
    id: 'Business',
    name: 'Business',
    emoji: '🎩',
    multiplier: 3.2,
    features: ['Lie-flat bed', 'Lounge access', 'Gourmet dining', 'Amenity kit', '3 checked bags', 'Chauffeur service'],
    description: 'Arrive refreshed and ready for business.',
  },
  {
    id: 'First',
    name: 'First Class',
    emoji: '👑',
    multiplier: 6,
    features: ['Private suite', 'Personal butler', 'Fine dining', 'Exclusive lounge', 'Unlimited bags', 'Rolls-Royce transfer'],
    description: 'The ultimate in luxury air travel.',
  },
]

const AMENITIES = [
  { icon: Wifi, label: 'Wi-Fi' },
  { icon: Tv, label: 'Entertainment' },
  { icon: Coffee, label: 'Meals' },
  { icon: Luggage, label: 'Baggage' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function FlightDetailPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedFlight } = useSelector((s) => s.booking)
  const [selectedClass, setClass] = useState('Economy')

  const flight = selectedFlight || {
    airline: 'Emirates', flightCode: 'EK203',
    departure: '08:00', arrival: '16:30',
    duration: '8h 30m', stops: 0,
    price: 499, fromCode: 'JFK', toCode: 'DXB',
    baggage: '23kg included', rating: '4.8',
  }

  const classObj = SEAT_CLASSES.find((c) => c.id === selectedClass)
  const finalPrice = Math.round(flight.price * (classObj?.multiplier || 1))

  const handleBook = () => {
    dispatch(setSelectedClass(selectedClass))
    navigate('/booking')
  }

  return (
    <PageTransition>
      <div className="detail-page">
        <div className="container">
          {/* Back */}
          <motion.button
            className="back-btn"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ChevronLeft size={18} />
            Back to Results
          </motion.button>

          {/* Main detail hero */}
          <motion.div
            className="detail-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Airline header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', color: 'white',
                }}>
                  {flight.airline?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{flight.airline}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Flight {flight.flightCode}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-success">⭐ {flight.rating} Rating</span>
                {flight.stops === 0 && <span className="badge badge-primary">⚡ Direct</span>}
              </div>
            </div>

            {/* Route visual */}
            <div className="detail-route">
              <div className="detail-route-point">
                <div className="detail-route-code">{flight.fromCode}</div>
                <div className="detail-route-city">
                  {flight.fromCode === 'JFK' ? 'New York' : flight.fromCode}
                </div>
                <div className="detail-route-time">{flight.departure}</div>
              </div>

              <div className="detail-divider">
                <div className="detail-duration">
                  <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                  {flight.duration}
                </div>
                <div className="detail-line" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className="detail-route-point">
                <div className="detail-route-code">{flight.toCode}</div>
                <div className="detail-route-city">
                  {flight.toCode === 'LHR' ? 'London' : flight.toCode === 'DXB' ? 'Dubai' : flight.toCode}
                </div>
                <div className="detail-route-time">{flight.arrival}</div>
              </div>
            </div>

            {/* Amenities */}
            <div style={{
              display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap',
              padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
              marginBottom: 32,
            }}>
              {AMENITIES.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                  whileHover={{ scale: 1.08, color: 'var(--primary-light)' }}
                >
                  <Icon size={16} color="var(--primary-light)" />
                  {label}
                </motion.div>
              ))}
            </div>

            {/* Seat Class Selector */}
            <h3 style={{ marginBottom: 20, fontSize: '1rem', fontWeight: 600 }}>Choose Your Cabin Class</h3>
            <div className="seat-classes">
              {SEAT_CLASSES.map((cls) => (
                <motion.div
                  key={cls.id}
                  className={`seat-class-card ${selectedClass === cls.id ? 'selected' : ''}`}
                  onClick={() => setClass(cls.id)}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div className="seat-class-icon">{cls.emoji}</div>
                  <div className="seat-class-name">{cls.name}</div>
                  <div className="seat-class-price">
                    ${Math.round(flight.price * cls.multiplier)}
                  </div>
                  {selectedClass === cls.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ marginTop: 8 }}
                    >
                      <CheckCircle size={16} color="var(--primary-light)" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected class features */}
            <motion.div
              key={selectedClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 24,
                background: 'rgba(99, 102, 241, 0.04)',
                border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
              }}
            >
              <div style={{ marginBottom: 12, fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-light)' }}>
                {classObj?.name} includes:
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {classObj?.features.map((f) => (
                  <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <CheckCircle size={13} color="var(--success)" /> {f}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Info cards */}
          <div className="info-grid">
            <motion.div className="info-card" variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
              <div className="info-card-title">
                <Info size={18} color="var(--primary-light)" />
                Flight Information
              </div>
              <ul className="info-list">
                <li><span className="check">✓</span> Aircraft: Boeing 777-300ER</li>
                <li><span className="check">✓</span> Meals: Complimentary on board</li>
                <li><span className="check">✓</span> Check-in: Opens 24 hours before</li>
                <li><span className="check">✓</span> Baggage: {flight.baggage}</li>
                <li><span className="check">✓</span> Flight operated by {flight.airline}</li>
              </ul>
            </motion.div>

            <motion.div className="info-card" variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
              <div className="info-card-title">
                <Luggage size={18} color="var(--primary-light)" />
                Baggage Policy
              </div>
              <ul className="info-list">
                <li><span className="check">✓</span> Carry-on: 7kg (55×40×20cm)</li>
                <li><span className="check">✓</span> Checked: {flight.baggage}</li>
                <li><span className="check">✓</span> Sports equipment: Available on request</li>
                <li><span className="check">✓</span> Extra baggage: $45 per 5kg</li>
                <li><span className="check">✓</span> Fragile items: Handled with care</li>
              </ul>
            </motion.div>
          </div>

          {/* Book CTA */}
          <motion.div
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-bright)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 36px',
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 4 }}>Total price ({classObj?.name})</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800 }}>
                <span className="text-gradient">${finalPrice}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>per person · taxes included</div>
            </div>
            <motion.button
              className="search-btn"
              style={{ width: 'auto', padding: '16px 48px', fontSize: '1.05rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBook}
            >
              <Plane size={20} />
              Book This Flight
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
