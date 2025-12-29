import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

export default function NavigationArrows({ currentIndex, totalRooms }) {
  const goToNextRoom = useAppStore((state) => state.goToNextRoom)
  const goToPrevRoom = useAppStore((state) => state.goToPrevRoom)
  const isTransitioning = useAppStore((state) => state.isTransitioning)

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < totalRooms - 1

  return (
    <>
      {/* Left Arrow - Previous */}
      <motion.div 
        className="nav-arrows left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button 
          className="nav-arrow"
          onClick={goToPrevRoom}
          disabled={!canGoPrev || isTransitioning}
          aria-label="Previous room"
        >
          <div className="arrow-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div className="arrow-line" />
          <span className="arrow-label">Prev</span>
        </button>
      </motion.div>

      {/* Right Arrow - Next */}
      <motion.div 
        className="nav-arrows right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button 
          className="nav-arrow"
          onClick={goToNextRoom}
          disabled={!canGoNext || isTransitioning}
          aria-label="Next room"
        >
          <span className="arrow-label">Next</span>
          <div className="arrow-line" />
          <div className="arrow-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>
      </motion.div>
    </>
  )
}

