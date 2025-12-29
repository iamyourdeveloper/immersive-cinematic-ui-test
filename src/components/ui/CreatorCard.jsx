import { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, CREATORS } from '../../store/useAppStore'

// Eye icon for watch button
const EyeIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 0.5C5.5 0.5 1.73 3.11 0 7C1.73 10.89 5.5 13.5 10 13.5C14.5 13.5 18.27 10.89 20 7C18.27 3.11 14.5 0.5 10 0.5ZM10 11.5C7.52 11.5 5.5 9.48 5.5 7C5.5 4.52 7.52 2.5 10 2.5C12.48 2.5 14.5 4.52 14.5 7C14.5 9.48 12.48 11.5 10 11.5ZM10 4.5C8.62 4.5 7.5 5.62 7.5 7C7.5 8.38 8.62 9.5 10 9.5C11.38 9.5 12.5 8.38 12.5 7C12.5 5.62 11.38 4.5 10 4.5Z" 
      fill="currentColor"
    />
  </svg>
)

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

export default function CreatorCard({ creator, index, isLibrary = false }) {
  const openVideoModal = useAppStore((state) => state.openVideoModal)
  const setCardHovered = useAppStore((state) => state.setCardHovered)
  const forceCloseHoveredCreator = useAppStore((state) => state.forceCloseHoveredCreator)
  
  const cardRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const isHoveredRef = useRef(false)

  // Calculate position based on door index
  // Left: 0, Center: 1, Right: 2
  const getPositionStyle = useCallback(() => {
    const baseStyles = {
      position: 'absolute',
      transform: 'translateY(-50%)',
      top: '45%',
    }
    
    // Library room positioning - cards appear higher to align with portraits
    if (isLibrary) {
      const libraryTop = '32%'
      switch (index) {
        case 0: // Left portrait
          return { ...baseStyles, top: libraryTop, left: '18%' }
        case 1: // Center portrait
          return { ...baseStyles, top: libraryTop, left: '50%', transform: 'translate(-50%, -50%)' }
        case 2: // Right portrait
          return { ...baseStyles, top: libraryTop, right: '18%' }
        default:
          return baseStyles
      }
    }
    
    // Origin Stories room positioning - cards appear higher to align with doors
    const originStoriesTop = '32%'
    switch (index) {
      case 0: // Left door - Hannah Beachler
        return { ...baseStyles, top: originStoriesTop, left: '15%' }
      case 1: // Center door - Jasmine Alexia
        return { ...baseStyles, top: originStoriesTop, left: '50%', transform: 'translate(-50%, -50%)' }
      case 2: // Right door - Alicia Diaz
        return { ...baseStyles, top: originStoriesTop, right: '25%' }
      default:
        return baseStyles
    }
  }, [index, isLibrary])

  const handleWatchClick = useCallback((e) => {
    e.stopPropagation()
    openVideoModal(creator)
  }, [creator, openVideoModal])

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    // Mark card as hovered in store
    setCardHovered(true)
  }, [setCardHovered])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    
    // Mark card as not hovered
    setCardHovered(false)
    
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    
    // Delay before closing to allow returning to the door
    hideTimeoutRef.current = setTimeout(() => {
      // Double check we're still not hovered
      if (!isHoveredRef.current) {
        forceCloseHoveredCreator()
      }
    }, 200)
  }, [setCardHovered, forceCloseHoveredCreator])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      // Ensure card hover is cleared on unmount
      setCardHovered(false)
    }
  }, [setCardHovered])
  
  if (!creator) return null

  return (
    <motion.div
      ref={cardRef}
      className="creator-card"
      style={getPositionStyle()}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Frame */}
      <div className="creator-card-frame">
        {/* Holographic Background Effect */}
        <div className="creator-card-hologram" />
        
        {/* Corner Accents */}
        <div className="creator-card-corner top-left" />
        <div className="creator-card-corner top-right" />
        <div className="creator-card-corner bottom-left" />
        <div className="creator-card-corner bottom-right" />

        {/* Watch Button */}
        <motion.button 
          className="creator-watch-btn"
          onClick={handleWatchClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="watch-btn-hex">
            <HexIcon />
          </span>
          <span className="watch-btn-content">
            <EyeIcon />
            <span>WATCH</span>
          </span>
        </motion.button>

        {/* Creator Image Area */}
        <div className="creator-card-image">
          <div className="creator-image-gradient" />
          {creator.image && (
            <img 
              src={creator.image} 
              alt={creator.name}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
        </div>

        {/* Name Section */}
        <div className="creator-card-info">
          <h3 className="creator-name">
            {creator.name.split(' ').map((word, i) => (
              <span key={i}>
                {i === 0 ? word : `·${word}·`}
                {i === 0 && <br />}
              </span>
            ))}
          </h3>
          
          {/* Wakanda Text */}
          <p className="creator-wakanda-text">{creator.wakandaText}</p>
          
          {/* Decorative Line */}
          <div className="creator-divider" />
          
          {/* Title */}
          <p className="creator-title">{creator.title}</p>
        </div>

        {/* Connector Line */}
        <div className="creator-connector-line" />
        
        {/* Hotspot Hexagon */}
        <div className="creator-hotspot">
          <HexIcon />
        </div>
      </div>
    </motion.div>
  )
}

// Wrapper component to manage multiple creator cards
export function CreatorCardsOverlay() {
  const hoveredCreator = useAppStore((state) => state.hoveredCreator)
  const currentRoom = useAppStore((state) => state.currentRoom)
  
  // Only show in Origin Stories or Library rooms
  const isOriginStories = currentRoom === 'origin-stories'
  const isLibrary = currentRoom === 'library'
  
  if (!isOriginStories && !isLibrary) return null

  // Use the appropriate creators data based on current room
  const creators = isLibrary ? CREATORS.library : CREATORS.originStories

  return (
    <div className="creator-cards-overlay">
      <AnimatePresence>
        {hoveredCreator !== null && creators[hoveredCreator] && (
          <CreatorCard 
            key={`${currentRoom}-${hoveredCreator}`}
            creator={creators[hoveredCreator]} 
            index={hoveredCreator}
            isLibrary={isLibrary}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
