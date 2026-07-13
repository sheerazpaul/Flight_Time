import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { MapPin, Calendar, Users, Plane, ArrowLeftRight, ChevronDown, Search } from 'lucide-react'
import { setSearchParams } from '../store/bookingSlice'
import { format, addDays } from 'date-fns'

const AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'USA' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA' },
  { code: 'LHR', city: 'London', country: 'UK' },
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan' },
  { code: 'SYD', city: 'Sydney', country: 'Australia' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'HKG', city: 'Hong Kong', country: 'China' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain' },
  { code: 'MXP', city: 'Milan', country: 'Italy' },
  { code: 'ATH', city: 'Athens', country: 'Greece' },
]

const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
const nextWeek = format(addDays(new Date(), 8), 'yyyy-MM-dd')

export default function SearchForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('oneWay')
  const [from, setFrom] = useState('JFK')
  const [to, setTo] = useState('LHR')
  const [depDate, setDepDate] = useState(tomorrow)
  const [retDate, setRetDate] = useState(nextWeek)
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [infants, setInfants] = useState('0')
  const [cabin, setCabin] = useState('Economy')
  const [currency, setCurrency] = useState('USD')

  const swapAirports = useCallback(() => {
    setFrom(to)
    setTo(from)
  }, [from, to])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = { tripType, from, to, depDate, retDate, adults, children, infants, cabin, currency }
    dispatch(setSearchParams(params))
    navigate(`/search?type=${tripType}&from=${from}&to=${to}&dep=${depDate}&ret=${retDate}&adults=${adults}&children=${children}&infants=${infants}&cabin=${cabin}&currency=${currency}`)
  }

  const SelectInput = ({ icon, value, onChange, children, label }) => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="form-input-wrapper">
        <span className="form-input-icon">{icon}</span>
        <select className="form-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
      </div>
    </div>
  )

  const DateInput = ({ label, icon, value, onChange, min }) => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="form-input-wrapper">
        <span className="form-input-icon">{icon}</span>
        <input type="date" className="form-input" value={value} onChange={(e) => onChange(e.target.value)} min={min || tomorrow} />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSearch} className="search-form-card">
      {/* Tabs */}
      <div className="search-tabs">
        {['oneWay', 'roundTrip'].map((type) => (
          <motion.button
            key={type}
            type="button"
            className={`search-tab ${tripType === type ? 'active' : ''}`}
            onClick={() => setTripType(type)}
            whileTap={{ scale: 0.97 }}
          >
            {type === 'oneWay' ? '✈ One Way' : '↔ Round Trip'}
          </motion.button>
        ))}
      </div>

      {/* Row 1: From / Swap / To / Departure */}
      <div className="search-grid">
        <SelectInput label="From" icon={<MapPin size={16} />} value={from} onChange={setFrom}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
          ))}
        </SelectInput>

        <motion.button
          type="button"
          className="swap-btn"
          onClick={swapAirports}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeftRight size={16} />
        </motion.button>

        <SelectInput label="To" icon={<MapPin size={16} />} value={to} onChange={setTo}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
          ))}
        </SelectInput>

        <DateInput
          label="Departure"
          icon={<Calendar size={16} />}
          value={depDate}
          onChange={setDepDate}
          min={tomorrow}
        />
      </div>

      {/* Row 2: Return / Adults / Cabin / Currency */}
      <div className="search-grid-row2">
        <AnimatePresence>
          {tripType === 'roundTrip' ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DateInput
                label="Return"
                icon={<Calendar size={16} />}
                value={retDate}
                onChange={setRetDate}
                min={depDate}
              />
            </motion.div>
          ) : (
            <SelectInput label="Children" icon={<Users size={16} />} value={children} onChange={setChildren}>
              {['0','1','2','3','4'].map((n) => <option key={n} value={n}>{n} Children</option>)}
            </SelectInput>
          )}
        </AnimatePresence>

        <SelectInput label="Adults" icon={<Users size={16} />} value={adults} onChange={setAdults}>
          {['1','2','3','4','5','6'].map((n) => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
        </SelectInput>

        <SelectInput label="Cabin Class" icon={<Plane size={16} />} value={cabin} onChange={setCabin}>
          {['Economy', 'Premium_Economy', 'Business', 'First'].map((c) => (
            <option key={c} value={c}>{c.replace('_', ' ')}</option>
          ))}
        </SelectInput>

        <SelectInput label="Currency" icon={<ChevronDown size={16} />} value={currency} onChange={setCurrency}>
          {['USD', 'EUR', 'GBP', 'AED', 'JPY', 'AUD', 'CAD'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectInput>
      </div>

      <motion.button
        type="submit"
        className="search-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Search size={18} />
        Search Flights
      </motion.button>
    </form>
  )
}
