import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plane, Globe, Shield, Zap, Star, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import PageTransition from '../components/PageTransition'

// Generate twinkling stars
function StarField() {
  return (
    <div className="hero-stars">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--duration': `${2 + Math.random() * 4}s`,
            '--opacity': Math.random() * 0.6 + 0.1,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

// Floating animated plane
function FloatingPlane() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        right: '8%',
        top: '20%',
        zIndex: 1,
        opacity: 0.12,
      }}
      animate={{
        y: [-20, 20, -20],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Plane size={220} color="white" />
    </motion.div>
  )
}

const DESTINATIONS = [
  { city: 'Dubai', country: 'United Arab Emirates', price: '499', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '🏙️' },
  { city: 'Tokyo', country: 'Japan', price: '780', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🗼' },
  { city: 'Paris', country: 'France', price: '420', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🗼' },
  { city: 'New York', country: 'USA', price: '310', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '🗽' },
  { city: 'Singapore', country: 'Singapore', price: '650', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', emoji: '🦁' },
  { city: 'Sydney', country: 'Australia', price: '890', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', emoji: '🦘' },
]

const STATS = [
  { number: '500+', label: 'Airlines', icon: Plane },
  { number: '10M+', label: 'Happy Travelers', icon: Star },
  { number: '180+', label: 'Countries', icon: Globe },
  { number: '24/7', label: 'Support', icon: Shield },
]

const FEATURES = [
  { icon: Zap, title: 'Instant Booking', desc: 'Book your flight in under 2 minutes with our streamlined process.' },
  { icon: Shield, title: 'Secure Payments', desc: 'Your data is protected with bank-level 256-bit SSL encryption.' },
  { icon: Globe, title: 'Best Price Guarantee', desc: 'Find it cheaper? We\'ll match the price. No questions asked.' },
  { icon: Star, title: 'Premium Support', desc: '24/7 concierge support for every traveler, every timezone.' },
]

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <StarField />
        <FloatingPlane />

        <div className="container hero-content">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp}>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                World's #1 Flight Booking Platform
              </span>
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              Fly to Your{' '}
              <span className="text-gradient">Dream</span>
              <br />
              Destination
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              Discover unbeatable flight deals across 500+ airlines. Compare prices, check schedules, and book instantly — all in one futuristic platform.
            </motion.p>

            {/* Search Form */}
            <motion.div variants={fadeUp}>
              <SearchForm />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
          >
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} className="stat-card" variants={fadeUp}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-tag">✈ Top Destinations</div>
            <h2 className="section-title">Popular <span className="text-gradient">Flight Routes</span></h2>
            <p className="section-subtitle">Handpicked destinations with the best deals this season</p>
          </motion.div>

          <motion.div
            className="destinations-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.city}
                className="dest-card"
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                {/* Gradient background instead of image */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: dest.gradient,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    opacity: 0.3,
                  }}
                >
                  {dest.emoji}
                </div>
                <div className="dest-card-overlay">
                  <div className="dest-country">{dest.country}</div>
                  <div className="dest-city">{dest.city}</div>
                  <div style={{ marginTop: 10 }}>
                    <span className="dest-price">from ${dest.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-tag">⚡ Why SkyVoyage</div>
            <h2 className="section-title">The <span className="text-gradient">Smartest Way</span> to Fly</h2>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                className="stat-card"
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  style={{
                    width: 52, height: 52,
                    background: 'var(--gradient-primary)',
                    borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    margin: '0 auto 20px',
                  }}
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <f.icon size={24} color="white" />
                </motion.div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(8,145,178,0.06) 100%)',
              border: '1px solid var(--border-bright)',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute', top: -60, right: -60, opacity: 0.08,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Globe size={300} color="white" />
            </motion.div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16, position: 'relative' }}>
              Ready to <span className="text-gradient">Take Off?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>
              Join 10 million+ travelers. Your next adventure is just one click away.
            </p>
            <motion.button
              className="search-btn"
              style={{ width: 'auto', margin: '0 auto' }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Plane size={18} />
              Start Searching
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Plane size={16} color="var(--primary-light)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)' }}>SkyVoyage</span>
          </div>
          <p>© 2026 SkyVoyage. All rights reserved. Powered by FlightAPI.io</p>
        </div>
      </footer>
    </PageTransition>
  )
}
