import { useAppStore } from '../../store/useAppStore'

export default function MenuButton() {
  const isMenuOpen = useAppStore((state) => state.isMenuOpen)
  const toggleMenu = useAppStore((state) => state.toggleMenu)

  return (
    <button 
      className={`menu-button ${isMenuOpen ? 'open' : ''}`}
      onClick={toggleMenu}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
    >
      <div className="menu-icon">
        <span className="menu-line" />
        <span className="menu-line" />
        <span className="menu-line" />
      </div>
    </button>
  )
}

