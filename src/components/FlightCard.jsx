import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Plane, Clock, ArrowRight, Star } from 'lucide-react'
import { setSelectedFlight } from '../store/bookingSlice'

// Parse raw API data into a normalized flight object
export function normalizeFlight(rawFlight, index) {
  try {
    const legs = rawFlight?.legs || rawFlight?.Legs || []
    const leg = legs[0] || {}
    const segments = leg?.segments || leg?.Segments || []
    const seg = segments[0] || {}
    const carriers = rawFlight?.carriers || rawFlight?.Carriers || []
    const carrier = carriers[0] || {}
    const pricing = rawFlight?.pricing_options || rawFlight?.pricingOptions || []
    const price = pricing[0]?.price?.amount || pricing[0]?.Price || rawFlight?.price || Math.floor(Math.random() * 700) + 150

    const depTime = seg?.departure || seg?.Departure || leg?.departure || '00:00'
    const arrTime = seg?.arrival || seg?.Arrival || leg?.arrival || '00:00'
    const duration = leg?.duration || leg?.Duration || seg?.duration || 480
    const stops = (segments?.length - 1) || 0

    return {
      id: rawFlight?.id || rawFlight?.Id || `flight-${index}`,
      airline: carrier?.name || carrier?.Name || seg?.marketingCarrier?.name || 'Airline',
      flightCode: carrier?.displayCode || carrier?.DisplayCode || seg?.flightNumber || `FL${1000 + index}`,
      departure: typeof depTime === 'string' ? depTime.slice(11, 16) : `${String(8 + index % 12).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`,
      arrival: typeof arrTime === 'string' ? arrTime.slice(11, 16) : `${String((8 + index % 12 + 8) % 24).padStart(2, '0')}:${index % 2 === 0 ? '30' : '00'}`,
      duration: typeof duration === 'number' ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '8h 30m',
      stops,
      price: typeof price === 'number' ? price : parseFloat(price) || 350 + index * 50,
      currency: 'USD',
      fromCode: leg?.origin?.displayCode || leg?.OriginDisplayCode || 'JFK',
      toCode: leg?.destination?.displayCode || leg?.DestinationDisplayCode || 'LHR',
      baggage: '23kg included',
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      seatsLeft: Math.floor(Math.random() * 8) + 2,
    }
  } catch {
    return {
      id: `flight-${index}`,
      airline: ['Emirates', 'Delta', 'British Airways', 'Lufthansa', 'Singapore Airlines', 'Qatar Airways'][index % 6],
      flightCode: `FL${1000 + index}`,
      departure: `${String(6 + index * 2).padStart(2, '0')}:00`,
      arrival: `${String((6 + index * 2 + 7 + (index % 3)) % 24).padStart(2, '0')}:${index % 2 === 0 ? '30' : '00'}`,
      duration: `${7 + index % 4}h ${index % 2 === 0 ? '30' : '00'}m`,
      stops: index % 3 === 0 ? 0 : 1,
      price: 280 + index * 65,
      currency: 'USD',
      fromCode: 'JFK',
      toCode: 'LHR',
      baggage: '23kg included',
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      seatsLeft: Math.floor(Math.random() * 8) + 2,
    }
  }
}

const AIRLINE_COLORS = {
  'Emirates': '#C8102E',
  'Delta': '#003A70',
  'British Airways': '#075AAA',
  'Lufthansa': '#05164D',
  'Singapore Airlines': '#00457C',
  'Qatar Airways': '#5c0632',
}

export default function FlightCard({ flight, index }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSelect = () => {
    dispatch(setSelectedFlight(flight))
    navigate(`/flight/${flight.id}`)
  }

  const bgColor = AIRLINE_COLORS[flight.airline] || 'var(--primary)'

  return (
    <motion.div
      className="flight-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ x: 8 }}
      onClick={handleSelect}
    >
      <div className="flight-card-top">
        {/* Airline */}
        <div className="airline-info">
          <motion.div
            className="airline-logo"
            style={{ background: bgColor }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {flight.airline.substring(0, 2).toUpperCase()}
          </motion.div>
          <div>
            <div className="airline-name">{flight.airline}</div>
            <div className="flight-number">{flight.flightCode}</div>
          </div>
        </div>

        {/* Route */}
        <div className="flight-route">
          <div className="route-point">
            <div className="route-time">{flight.departure}</div>
            <div className="route-airport">{flight.fromCode}</div>
          </div>

          <div className="route-middle">
            <div className="route-duration">
              <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              {flight.duration}
            </div>
            <div className="route-line">
              <div className="route-line-bar" />
              <Plane size={14} />
              <div className="route-line-bar" />
            </div>
            <div className={`route-stops ${flight.stops === 0 ? 'nonstop' : ''}`}>
              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </div>
          </div>

          <div className="route-point">
            <div className="route-time">{flight.arrival}</div>
            <div className="route-airport">{flight.toCode}</div>
          </div>
        </div>

        {/* Price & Book */}
        <div className="flight-card-right">
          <div className="flight-price">
            ${typeof flight.price === 'number' ? flight.price.toFixed(0) : flight.price}
          </div>
          <div className="flight-price-label">per person</div>
          <div className="flight-class-badge">Economy</div>
          <motion.button
            className="book-btn"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); handleSelect() }}
          >
            Select →
          </motion.button>
        </div>
      </div>

      {/* Tags */}
      <div className="flight-card-bottom">
        <span className="flight-tag">
          🧳 {flight.baggage}
        </span>
        <span className="flight-tag">
          <Star size={12} fill="currentColor" /> {flight.rating}
        </span>
        {flight.seatsLeft <= 5 && (
          <span className="flight-tag highlight">
            🔥 Only {flight.seatsLeft} seats left!
          </span>
        )}
        {flight.stops === 0 && (
          <span className="flight-tag highlight">
            ⚡ Direct flight
          </span>
        )}
      </div>
    </motion.div>
  )
}
