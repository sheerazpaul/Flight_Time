import { motion } from 'framer-motion'

export function FlightCardSkeleton({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <motion.div
      key={i}
      className="skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.08 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 8 }} />
          <div>
            <div className="skeleton" style={{ width: 100, height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 60, height: 11 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, flex: 1, justifyContent: 'center' }}>
          <div>
            <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 40, height: 11 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 60, height: 11 }} />
            <div className="skeleton" style={{ width: '100%', height: 4 }} />
            <div className="skeleton" style={{ width: 50, height: 11 }} />
          </div>
          <div>
            <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 40, height: 11 }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="skeleton" style={{ width: 80, height: 32, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 100, height: 32, marginTop: 12 }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        {[80, 60, 100].map((w, j) => (
          <div key={j} className="skeleton" style={{ width: w, height: 26, borderRadius: 999 }} />
        ))}
      </div>
    </motion.div>
  ))
}
