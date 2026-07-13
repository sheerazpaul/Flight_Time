import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

const ToasterContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToasterContext)
  if (!ctx) throw new Error('useToast must be used inside ToasterProvider')
  return ctx
}

let externalShowToast = null

export function showToast(message, type = 'success') {
  if (externalShowToast) externalShowToast(message, type)
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    externalShowToast = (message, type = 'success') => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    }
    return () => { externalShowToast = null }
  }, [])

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="toaster">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type}`}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <span className="toast-icon">
              {toast.type === 'success' ? <CheckCircle size={20} color="var(--success)" /> : <XCircle size={20} color="var(--danger)" />}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
