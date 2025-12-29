import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

// X/Close icon
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M1 1L13 13M1 13L13 1" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default function QuoteModal() {
  const quoteModalData = useAppStore((state) => state.quoteModalData)
  const closeQuoteModal = useAppStore((state) => state.closeQuoteModal)

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeQuoteModal()
    }
  }, [closeQuoteModal])

  const handleCloseClick = useCallback(() => {
    closeQuoteModal()
  }, [closeQuoteModal])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && quoteModalData) {
        closeQuoteModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [quoteModalData, closeQuoteModal])

  return (
    <AnimatePresence>
      {quoteModalData && (
        <motion.div 
          className="quote-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="quote-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <motion.button 
              className="quote-close-btn"
              onClick={handleCloseClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="close-icon"><CloseIcon /></span>
              <span className="close-text">CLOSE QUOTE</span>
              <span className="close-line" />
            </motion.button>

            <div className="quote-modal-frame">
              {/* Corner Accents */}
              <div className="quote-corner top-left" />
              <div className="quote-corner top-right" />
              <div className="quote-corner bottom-left" />
              <div className="quote-corner bottom-right" />

              {/* Content */}
              <div className="quote-modal-content">
                {/* Top decorative element */}
                <div className="quote-decor-top">
                  <span className="decor-dash" />
                </div>

                {/* Quote Text */}
                <h2 className="quote-text">{quoteModalData.quote}</h2>

                {/* Bottom decorative element */}
                <div className="quote-decor-bottom">
                  <span className="decor-dash" />
                </div>

                {/* Character Name */}
                <div className="quote-character">
                  <h3 className="character-name">{quoteModalData.name}</h3>
                  <p className="character-wakanda">{quoteModalData.wakandaText}</p>
                </div>

                {/* Divider dot */}
                <div className="quote-divider-dot" />

                {/* Description */}
                <p className="quote-description">{quoteModalData.description}</p>
              </div>

              {/* Subtle vertical lines on sides */}
              <div className="quote-side-line left" />
              <div className="quote-side-line right" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

