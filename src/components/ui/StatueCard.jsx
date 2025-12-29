import { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, CREATORS } from '../../store/useAppStore'

// Hexagon icon for decoration
const HexIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8 0L15.5 4.5V13.5L8 18L0.5 13.5V4.5L8 0Z" 
      stroke="currentColor" 
      strokeWidth="1"
      fill="none"
    />
  </svg>
)

// Book/Read icon
const ReadIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M1 2C1 2 3 1 5.5 1C8 1 9 2 9 2V14C9 14 8 13.5 5.5 13.5C3 13.5 1 14 1 14V2Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M17 2C17 2 15 1 12.5 1C10 1 9 2 9 2V14C9 14 10 13.5 12.5 13.5C15 13.5 17 14 17 14V2Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function StatueCard({ character, index }) {
  const openQuoteModal = useAppStore((state) => state.openQuoteModal)
  const setStatueCardHovered = useAppStore((state) => state.setStatueCardHovered)
  const forceCloseHoveredStatue = useAppStore((state) => state.forceCloseHoveredStatue)
  
  const cardRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const isHoveredRef = useRef(false)

  // Calculate position based on statue index
  const getPositionStyle = useCallback(() => {
    const baseStyles = {
      position: 'absolute',
      transform: 'translateY(-50%)',
      top: '42%',
    }
    
    switch (index) {
      case 0: // Left statue - Dora Milaje
        return { ...baseStyles, left: '22%' }
      case 1: // Center statue - Shuri
        return { ...baseStyles, left: '50%', transform: 'translate(-50%, -50%)' }
      case 2: // Right statue - M'Baku
        return { ...baseStyles, right: '22%' }
      default:
        return baseStyles
    }
  }, [index])

  const handleReadClick = useCallback((e) => {
    e.stopPropagation()
    openQuoteModal(character)
  }, [character, openQuoteModal])

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setStatueCardHovered(true)
  }, [setStatueCardHovered])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    setStatueCardHovered(false)
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        forceCloseHoveredStatue()
      }
    }, 200)
  }, [setStatueCardHovered, forceCloseHoveredStatue])

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      setStatueCardHovered(false)
    }
  }, [setStatueCardHovered])
  
  if (!character) return null

  return (
    <motion.div
      ref={cardRef}
      className="statue-card"
      style={getPositionStyle()}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="statue-card-frame">
        {/* Holographic Background Effect */}
        <div className="statue-card-hologram" />
        
        {/* Corner Accents */}
        <div className="statue-card-corner top-left" />
        <div className="statue-card-corner top-right" />
        <div className="statue-card-corner bottom-left" />
        <div className="statue-card-corner bottom-right" />

        {/* Read Button */}
        <motion.button 
          className="statue-read-btn"
          onClick={handleReadClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="read-btn-hex">
            <HexIcon />
          </span>
          <span className="read-btn-content">
            <ReadIcon />
            <span>READ</span>
          </span>
        </motion.button>

        {/* Name Section */}
        <div className="statue-card-info">
          <h3 className="statue-name">{character.name}</h3>
          
          {/* Wakanda Text */}
          <p className="statue-wakanda-text">{character.wakandaText}</p>
        </div>

        {/* Connector Line */}
        <div className="statue-connector-line" />
        
        {/* Hotspot Hexagon */}
        <div className="statue-hotspot">
          <HexIcon />
        </div>
      </div>
    </motion.div>
  )
}

// Wrapper component to manage statue cards in Inspiration Garden
export function StatueCardsOverlay() {
  const hoveredStatue = useAppStore((state) => state.hoveredStatue)
  const currentRoom = useAppStore((state) => state.currentRoom)
  
  const isInspirationGarden = currentRoom === 'inspiration-garden'
  
  if (!isInspirationGarden) return null

  const characters = CREATORS.inspirationGarden

  return (
    <div className="statue-cards-overlay">
      <AnimatePresence>
        {hoveredStatue !== null && characters[hoveredStatue] && (
          <StatueCard 
            key={`statue-${hoveredStatue}`}
            character={characters[hoveredStatue]} 
            index={hoveredStatue}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

