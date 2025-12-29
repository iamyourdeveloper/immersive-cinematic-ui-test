export default function Footer() {
  return (
    <footer className="ui-footer">
      <div className="footer-branding">
        {/* Sprite Logo */}
        <svg className="footer-logo" viewBox="0 0 80 30" fill="none">
          <path 
            d="M40 2L55 8V22L40 28L25 22V8L40 2Z" 
            stroke="var(--neon-green)" 
            strokeWidth="1"
            fill="rgba(0, 255, 136, 0.05)"
          />
          <text 
            x="40" 
            y="17" 
            textAnchor="middle" 
            fill="var(--neon-green)" 
            fontSize="7"
            fontFamily="var(--font-display)"
          >
            SPRITE
          </text>
        </svg>

        <div className="footer-divider" />

        {/* Wakanda Logo */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.5rem',
          color: 'var(--text-muted)',
          lineHeight: 1.2
        }}>
          <div style={{ fontWeight: 700, color: 'var(--gold-accent)' }}>WAKANDA</div>
          <div style={{ fontWeight: 700, color: 'var(--gold-accent)' }}>FOREVER</div>
        </div>

        <div className="footer-divider" />

        <span className="footer-text">Sprite Zero Sugar® | © MARVEL</span>
      </div>
    </footer>
  )
}

