import { motion } from 'framer-motion'
import { useAppStore, ROOM_ORDER, ROOM_DATA } from '../../store/useAppStore'

export default function SideMenu() {
  const closeMenu = useAppStore((state) => state.closeMenu)
  const currentRoom = useAppStore((state) => state.currentRoom)
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)

  const handleNavClick = (room) => {
    setCurrentRoom(room)
    closeMenu()
  }

  return (
    <motion.aside 
      className="side-menu"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="menu-header">
        <button 
          className="menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="menu-nav">
        <ul className="menu-nav-list">
          {ROOM_ORDER.map((room) => (
            <motion.li 
              key={room}
              className="menu-nav-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ROOM_ORDER.indexOf(room) * 0.05 }}
            >
              <button
                className={`menu-nav-link ${currentRoom === room ? 'active' : ''}`}
                onClick={() => handleNavClick(room)}
              >
                {ROOM_DATA[room]?.title || room}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="menu-footer">
        <div className="footer-branding">
          <span className="footer-text">Sprite Zero Sugar® | © MARVEL</span>
        </div>
      </div>
    </motion.aside>
  )
}

