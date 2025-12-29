import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, ROOM_DATA, ROOM_ORDER, ROOMS } from '../../store/useAppStore'
import NavigationArrows from './NavigationArrows'
import RoomInfo from './RoomInfo'
import MenuButton from './MenuButton'
import SideMenu from './SideMenu'
import Footer from './Footer'
import { CreatorCardsOverlay } from './CreatorCard'
import { StatueCardsOverlay } from './StatueCard'
import VideoModal from './VideoModal'
import QuoteModal from './QuoteModal'
import QuizModal from './QuizModal'
import './UIOverlay.css'

// Rooms that show the hover hint
const HOVER_HINT_ROOMS = [
  ROOMS.ORIGIN_STORIES,
  ROOMS.LIBRARY,
  ROOMS.INSPIRATION_GARDEN
]

export default function UIOverlay({ currentRoom }) {
  const isMenuOpen = useAppStore((state) => state.isMenuOpen)
  const isTransitioning = useAppStore((state) => state.isTransitioning)
  const roomData = ROOM_DATA[currentRoom]
  const currentIndex = ROOM_ORDER.indexOf(currentRoom)
  const showHoverHint = HOVER_HINT_ROOMS.includes(currentRoom)

  return (
    <div className="ui-overlay">
      {/* Header */}
      <header className="ui-header">
        {/* Logo - Click to refresh and return to Welcome Lobby */}
        <div 
          className="header-logo clickable-logo"
          onClick={() => window.location.reload()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && window.location.reload()}
          title="Return to Welcome Lobby"
        >
          <span className="logo-the">THE</span>
          <span className="logo-hall">HALL</span>
          <span className="logo-of">OF</span>
          <br />
          <span className="logo-zero">ZERO</span>
          <span className="logo-limits"> LIMITS</span>
        </div>

        {/* Menu Button */}
        <MenuButton />
      </header>

      {/* Hover Hint for Interactive Rooms */}
      <AnimatePresence>
        {showHoverHint && !isTransitioning && (
          <HoverHintText key="hover-hint" />
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <NavigationArrows 
        currentIndex={currentIndex}
        totalRooms={ROOM_ORDER.length}
      />

      {/* Room Information */}
      <AnimatePresence mode="wait">
        <RoomInfo 
          key={currentRoom}
          title={roomData?.title}
          subtitle={roomData?.subtitle}
        />
      </AnimatePresence>

      {/* Creator Cards Overlay - for Origin Stories room */}
      <CreatorCardsOverlay />

      {/* Statue Cards Overlay - for Inspiration Garden room */}
      <StatueCardsOverlay />

      {/* Footer */}
      <Footer />

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && <SideMenu />}
      </AnimatePresence>

      {/* Video Modal */}
      <VideoModal />

      {/* Quote Modal - for Inspiration Garden */}
      <QuoteModal />

      {/* Quiz Modal - for Find Your Gift */}
      <QuizModal />

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Hover Hint Text Component
function HoverHintText() {
  return (
    <motion.div 
      className="hover-hint-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="hover-hint-icon">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </div>
      <div className="hover-hint-text">
        Hover upon each object for more content
      </div>
    </motion.div>
  )
}
