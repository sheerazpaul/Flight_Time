import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Plane, AlertTriangle, RefreshCw } from 'lucide-react'
import { useSearchOneWayQuery, useSearchRoundTripQuery } from '../store/flightApi'
import FlightCard, { normalizeFlight } from '../components/FlightCard'
import { FlightCardSkeleton } from '../components/FlightCardSkeleton'
import SearchForm from '../components/SearchForm'
import PageTransition from '../components/PageTransition'

// Generate realistic mock flights for demo/fallback
function generateMockFlights(from, to, count = 8) {
  const airlines = ['Emirates', 'Delta', 'British Airways', 'Lufthansa', 'Singapore Airlines', 'Qatar Airways', 'Air France', 'KLM']
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    airline: airlines[i % airlines.length],
    flightCode: `${['EK','DL','BA','LH','SQ','QR','AF','KL'][i % 8]}${Math.floor(Math.random() * 900) + 100}`,
    departure: `${String(6 + i * 2).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${String((6 + i * 2 + 7 + (i % 3)) % 24).padStart(2, '0')}:${i % 2 === 0 ? '30' : '00'}`,
    duration: `${7 + i % 5}h ${i % 4 * 15}m`,
    stops: i % 3 === 0 ? 0 : i % 2,
    price: 180 + i * 85 + Math.floor(Math.random() * 50),
    currency: 'USD',
    fromCode: from || 'JFK',
    toCode: to || 'LHR',
    baggage: i % 2 === 0 ? '23kg included' : '15kg included',
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    seatsLeft: Math.floor(Math.random() * 9) + 1,
  }))
}

const CABIN_LABELS = {
  Economy: { emoji: '💺', price: 0 },
  Premium_Economy: { emoji: '🛋️', price: 180 },
  Business: { emoji: '🎩', price: 600 },
  First: { emoji: '👑', price: 1800 },
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const type = searchParams.get('type') || 'oneWay'
  const from = searchParams.get('from') || 'JFK'
  const to = searchParams.get('to') || 'LHR'
  const dep = searchParams.get('dep') || ''
  const ret = searchParams.get('ret') || ''
  const adults = searchParams.get('adults') || '1'
  const children = searchParams.get('children') || '0'
  const infants = searchParams.get('infants') || '0'
  const cabin = searchParams.get('cabin') || 'Economy'
  const currency = searchParams.get('currency') || 'USD'

  // Filters state
  const [sortBy, setSortBy] = useState('price')
  const [maxPrice, setMaxPrice] = useState(2000)
  const [stopsFilter, setStopsFilter] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  // RTK Query
  const oneWayResult = useSearchOneWayQuery(
    { from, to, date: dep, adults, children, infants, cabin, currency },
    { skip: type !== 'oneWay' || !dep }
  )
  const roundTripResult = useSearchRoundTripQuery(
    { from, to, depDate: dep, retDate: ret, adults, children, infants, cabin, currency },
    { skip: type !== 'roundTrip' || !dep || !ret }
  )

  const activeResult = type === 'roundTrip' ? roundTripResult : oneWayResult
  const { data, isLoading, isFetching, isError, error } = activeResult

  // Process flights from API or use mocks
  const rawFlights = useMemo(() => {
    if (isLoading || isFetching) return []

    // Try to parse real API response
    if (data) {
      try {
        // FlightAPI returns an array or object with itineraries
        const itineraries = Array.isArray(data) ? data
          : data?.itineraries || data?.Itineraries
            || data?.flights || data?.Flights
            || data?.data || []

        if (Array.isArray(itineraries) && itineraries.length > 0) {
          return itineraries.map(normalizeFlight)
        }
      } catch (e) {
        console.warn('Could not parse API response, using mock data')
      }
    }

    // Fallback: generate mock data for demo
    return generateMockFlights(from, to, 10)
  }, [data, isLoading, isFetching, from, to])

  // Apply filters & sort
  const flights = useMemo(() => {
    let result = [...rawFlights]

    if (stopsFilter.length > 0) {
      result = result.filter((f) => stopsFilter.includes(f.stops))
    }
    result = result.filter((f) => f.price <= maxPrice)

    if (sortBy === 'price') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'duration') result.sort((a, b) => a.duration.localeCompare(b.duration))
    else if (sortBy === 'departure') result.sort((a, b) => a.departure.localeCompare(b.departure))
    else if (sortBy === 'rating') result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))

    return result
  }, [rawFlights, sortBy, maxPrice, stopsFilter])

  const toggleStop = (n) => {
    setStopsFilter((prev) =>
      prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n]
    )
  }

  const usingMockData = !isLoading && !isError && data && rawFlights === flights && !data?.itineraries && !data?.flights

  return (
    <PageTransition>
      <div className="results-page">
        <div className="container">
          {/* Header */}
          <motion.div
            className="results-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
                    {from}
                  </span>
                  <Plane size={20} color="var(--primary-light)" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
                    {to}
                  </span>
                </div>
                <p className="results-meta">
                  {dep} {type === 'roundTrip' ? `→ ${ret}` : ''} · {adults} adult{adults > 1 ? 's' : ''} · {cabin.replace('_', ' ')} ·{' '}
                  <span style={{ color: isLoading ? 'var(--warning)' : 'var(--success)' }}>
                    {isLoading ? 'Searching...' : `${flights.length} flights found`}
                  </span>
                </p>
              </div>
              <motion.button
                onClick={() => setShowSearch((s) => !s)}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-secondary)',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-primary)',
                  fontSize: '0.88rem',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw size={15} />
                Modify Search
              </motion.button>
            </div>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ overflow: 'hidden' }}
                >
                  <SearchForm />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error Banner */}
          {isError && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle size={20} />
              <div>
                <strong>API Note:</strong> Showing demo flight data.{' '}
                {error?.status === 429
                  ? 'Rate limit exceeded — please wait before searching again.'
                  : error?.status === 410
                  ? 'No flights found for these dates. Showing sample data.'
                  : `Live data unavailable (${error?.status || 'network error'}).`}
              </div>
            </motion.div>
          )}

          {/* Main Layout */}
          <div className="results-layout">
            {/* Filters */}
            <motion.aside
              className="filters-panel"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="filters-title">
                <SlidersHorizontal size={18} color="var(--primary-light)" />
                Filters
              </div>

              {/* Sort */}
              <div className="filter-group">
                <div className="filter-group-title">Sort By</div>
                {['price', 'duration', 'departure', 'rating'].map((opt) => (
                  <motion.label
                    key={opt}
                    className="filter-option"
                    whileHover={{ x: 4 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSortBy(opt)}
                  >
                    <div className={`filter-checkbox ${sortBy === opt ? 'checked' : ''}`}>
                      {sortBy === opt && <span style={{ color: 'white', fontSize: '0.7rem' }}>✓</span>}
                    </div>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </motion.label>
                ))}
              </div>

              {/* Stops */}
              <div className="filter-group">
                <div className="filter-group-title">Stops</div>
                {[{ val: 0, label: 'Nonstop' }, { val: 1, label: '1 Stop' }, { val: 2, label: '2+ Stops' }].map((s) => (
                  <motion.label
                    key={s.val}
                    className="filter-option"
                    whileHover={{ x: 4 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleStop(s.val)}
                  >
                    <div className={`filter-checkbox ${stopsFilter.includes(s.val) ? 'checked' : ''}`}>
                      {stopsFilter.includes(s.val) && <span style={{ color: 'white', fontSize: '0.7rem' }}>✓</span>}
                    </div>
                    {s.label}
                  </motion.label>
                ))}
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <div className="filter-group-title">Max Price</div>
                <input
                  type="range"
                  className="range-input"
                  min={100}
                  max={3000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((maxPrice - 100) / 2900) * 100}%, rgba(0,0,0,0.08) ${((maxPrice - 100) / 2900) * 100}%)`
                  }}
                />
                <div className="price-range-label">
                  <span>$100</span>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>${maxPrice}</span>
                </div>
              </div>

              {/* Cabin Classes */}
              <div className="filter-group">
                <div className="filter-group-title">Cabin Class</div>
                {Object.entries(CABIN_LABELS).map(([cls, val]) => (
                  <div key={cls} className="filter-option">
                    <span>{val.emoji}</span>
                    <span>{cls.replace('_', ' ')}</span>
                    {val.price > 0 && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>+${val.price}</span>}
                  </div>
                ))}
              </div>
            </motion.aside>

            {/* Flight List */}
            <div className="flights-list">
              {(isLoading || isFetching) ? (
                <FlightCardSkeleton count={5} />
              ) : flights.length === 0 ? (
                <motion.div
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="empty-icon">✈️</div>
                  <div className="empty-title">No Flights Found</div>
                  <p className="empty-desc">Try adjusting your filters or search for different dates.</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {flights.map((flight, i) => (
                    <FlightCard key={flight.id} flight={flight} index={i} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
