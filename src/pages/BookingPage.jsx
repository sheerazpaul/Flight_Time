import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Calendar, ChevronLeft, Plane, CreditCard, Lock, Shield } from 'lucide-react'
import { setPassengerDetails, setBookingReference } from '../store/bookingSlice'
import { showToast } from '../components/ui/Toaster'
import PageTransition from '../components/PageTransition'

const SEAT_MULTIPLIERS = {
  Economy: 1, Premium_Economy: 1.5, Business: 3.2, First: 6,
}

const TAXES = 0.12 // 12%

function generateRef() {
  return `SKY${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export default function BookingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedFlight, selectedClass, searchParams } = useSelector((s) => s.booking)
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm()

  const flight = selectedFlight || {
    airline: 'Emirates', flightCode: 'EK203',
    departure: '08:00', arrival: '16:30',
    duration: '8h 30m',
    price: 499,
    fromCode: 'JFK', toCode: 'DXB',
  }

  const cls = selectedClass || 'Economy'
  const basePrice = Math.round(flight.price * (SEAT_MULTIPLIERS[cls] || 1))
  const taxes = Math.round(basePrice * TAXES)
  const total = basePrice + taxes + 25 // +$25 booking fee

  const handleNextStep = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'dob', 'passport'])
    if (valid) setStep(2)
  }

  const onSubmit = async (data) => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 2200)) // simulate API call

    const ref = generateRef()
    dispatch(setPassengerDetails(data))
    dispatch(setBookingReference(ref))
    showToast('🎉 Booking confirmed! Check your email.', 'success')
    navigate('/confirmation')
  }

  const InputField = ({ name, label, icon: Icon, type = 'text', placeholder, rules, colSpan = 1 }) => (
    <div className="form-field-booking" style={{ gridColumn: `span ${colSpan}` }}>
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={16}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-light)', zIndex: 1 }}
          />
        )}
        <input
          type={type}
          className="form-input-booking"
          placeholder={placeholder}
          style={{ paddingLeft: Icon ? 44 : 16 }}
          {...register(name, rules)}
        />
      </div>
      {errors[name] && <span className="form-error">⚠ {errors[name].message}</span>}
    </div>
  )

  return (
    <PageTransition>
      <div className="booking-page">
        <div className="container">
          <motion.button
            className="back-btn"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ChevronLeft size={18} />
            Back to Flight Details
          </motion.button>

          <motion.h1
            style={{ fontSize: '1.8rem', marginBottom: 32 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Complete Your <span className="text-gradient">Booking</span>
          </motion.h1>

          {/* Progress Steps */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {['Passenger Info', 'Payment'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: step >= i + 1 ? 'var(--gradient-primary)' : 'rgba(0,0,0,0.04)',
                    border: `2px solid ${step >= i + 1 ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem', color: step >= i + 1 ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.88rem', fontWeight: 500,
                    color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                    {s}
                  </span>
                </div>
                {i < 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: '0 16px',
                    background: step > 1 ? 'var(--gradient-primary)' : 'var(--border)',
                    transition: 'all 0.3s ease',
                  }} />
                )}
              </div>
            ))}
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="booking-layout">
              {/* Left: Form */}
              <div>
                {/* Step 1: Passenger Info */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      className="booking-form-section"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="booking-section-title">
                        <div className="step-badge">1</div>
                        Passenger Information
                      </div>

                      <div className="form-row">
                        <InputField
                          name="firstName"
                          label="First Name"
                          icon={User}
                          placeholder="John"
                          rules={{ required: 'First name is required' }}
                        />
                        <InputField
                          name="lastName"
                          label="Last Name"
                          icon={User}
                          placeholder="Doe"
                          rules={{ required: 'Last name is required' }}
                        />
                      </div>

                      <InputField
                        name="email"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="john.doe@example.com"
                        rules={{
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                        }}
                      />

                      <div className="form-row">
                        <InputField
                          name="phone"
                          label="Phone Number"
                          icon={Phone}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          rules={{ required: 'Phone is required' }}
                        />
                        <InputField
                          name="dob"
                          label="Date of Birth"
                          icon={Calendar}
                          type="date"
                          rules={{ required: 'Date of birth is required' }}
                        />
                      </div>

                      <InputField
                        name="passport"
                        label="Passport / ID Number"
                        icon={User}
                        placeholder="A12345678"
                        rules={{ required: 'Passport number is required' }}
                      />

                      <div className="form-field-booking">
                        <label className="form-label">Nationality</label>
                        <select className="form-input-booking" {...register('nationality', { required: true })}>
                          <option value="">Select nationality</option>
                          {['American', 'British', 'French', 'German', 'Australian', 'Greek', 'Canadian', 'Other'].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>

                      <motion.button
                        type="button"
                        className="search-btn"
                        style={{ marginTop: 24 }}
                        onClick={handleNextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Payment →
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      className="booking-form-section"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="booking-section-title">
                        <div className="step-badge">2</div>
                        Payment Details
                      </div>

                      <div style={{
                        background: 'rgba(5, 150, 105, 0.04)',
                        border: '1px solid rgba(5, 150, 105, 0.12)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.85rem',
                        color: 'var(--success)',
                      }}>
                        <Shield size={16} />
                        Your payment is secured with 256-bit SSL encryption
                      </div>

                      <InputField
                        name="cardName"
                        label="Cardholder Name"
                        icon={User}
                        placeholder="John Doe"
                        rules={{ required: 'Cardholder name is required' }}
                      />

                      <InputField
                        name="cardNumber"
                        label="Card Number"
                        icon={CreditCard}
                        placeholder="1234 5678 9012 3456"
                        rules={{
                          required: 'Card number is required',
                          pattern: { value: /^[\d\s]{16,19}$/, message: 'Invalid card number' },
                        }}
                      />

                      <div className="form-row">
                        <InputField
                          name="expiry"
                          label="Expiry Date"
                          icon={Calendar}
                          placeholder="MM/YY"
                          rules={{ required: 'Expiry is required' }}
                        />
                        <InputField
                          name="cvv"
                          label="CVV"
                          icon={Lock}
                          type="password"
                          placeholder="•••"
                          rules={{ required: 'CVV is required', minLength: { value: 3, message: 'Invalid CVV' } }}
                        />
                      </div>

                      {/* Card Type selector */}
                      <div className="form-field-booking">
                        <label className="form-label">Card Type</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          {['Visa', 'Mastercard', 'Amex', 'Discover'].map((card) => (
                            <label
                              key={card}
                              style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.02)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '10px',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <input type="radio" value={card} {...register('cardType')} style={{ display: 'none' }} />
                              {card}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <motion.button
                          type="button"
                          className="conf-btn-secondary"
                          onClick={() => setStep(1)}
                          whileHover={{ scale: 1.02 }}
                          style={{ flex: 1 }}
                        >
                          ← Back
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="pay-btn"
                          style={{ flex: 2 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ display: 'inline-block' }}
                              >
                                ⏳
                              </motion.span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock size={18} />
                              Pay ${total} Securely
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Order Summary */}
              <motion.div
                className="order-summary"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="summary-title">Order Summary</div>

                <div className="summary-flight-info">
                  <div className="summary-route">
                    <span className="summary-code">{flight.fromCode}</span>
                    <span className="summary-arrow">
                      <Plane size={20} color="var(--primary-light)" />
                    </span>
                    <span className="summary-code">{flight.toCode}</span>
                  </div>
                  <div className="summary-details">
                    {flight.airline} · {flight.flightCode}
                  </div>
                  <div className="summary-details" style={{ marginTop: 6 }}>
                    {flight.departure} → {flight.arrival} · {flight.duration}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span className="badge badge-primary">{cls.replace('_', ' ')}</span>
                  </div>
                </div>

                <ul className="price-breakdown">
                  <li>
                    <span>Base fare</span>
                    <span>${basePrice}</span>
                  </li>
                  <li>
                    <span>Taxes & fees (12%)</span>
                    <span>${taxes}</span>
                  </li>
                  <li>
                    <span>Booking fee</span>
                    <span>$25</span>
                  </li>
                  <li className="total">
                    <span>Total</span>
                    <span>${total}</span>
                  </li>
                </ul>

                <div style={{
                  background: 'rgba(99, 102, 241, 0.04)',
                  border: '1px solid rgba(99,102,241,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  <div style={{ color: 'var(--primary-light)', fontWeight: 600, marginBottom: 4 }}>✅ Free Cancellation</div>
                  Cancel up to 24 hours before departure for a full refund. No questions asked.
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
