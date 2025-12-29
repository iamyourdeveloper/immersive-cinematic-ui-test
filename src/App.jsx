import { Suspense, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

// Components
import LoadingScreen from './components/LoadingScreen'
import Experience from './components/Experience'
import UIOverlay from './components/ui/UIOverlay'
import { useAppStore } from './store/useAppStore'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const currentRoom = useAppStore((state) => state.currentRoom)

  // Handle loading completion
  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true)
  }, [])

  // Handle entering the experience
  const handleEnter = useCallback(() => {
    setShowIntro(false)
  }, [])

  return (
    <div className="app-container">
      {/* Loading Screen */}
      {!isLoaded && (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      )}

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
          camera={{ 
            fov: 45, 
            near: 0.1, 
            far: 1000,
            position: [0, 0, 10]
          }}
        >
          <Suspense fallback={null}>
            <Experience 
              isLoaded={isLoaded} 
              showIntro={showIntro}
              onEnter={handleEnter}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      {isLoaded && !showIntro && (
        <UIOverlay currentRoom={currentRoom} />
      )}

      {/* Intro Overlay */}
      {isLoaded && showIntro && (
        <IntroOverlay onEnter={handleEnter} />
      )}
    </div>
  )
}

// Intro Overlay Component
function IntroOverlay({ onEnter }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease'
      }}
    >
      {/* Brand Logos */}
      <div className="brand-logos" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <SpriteLogo />
        <span style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: '1.5rem',
          fontWeight: 300
        }}>×</span>
        <WakandaLogo />
      </div>

      {/* Main Title */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        color: 'var(--text-primary)',
        textAlign: 'center',
        marginBottom: '0.5rem',
        letterSpacing: '0.1em'
      }}>
        <span style={{ fontWeight: 300, fontSize: '0.6em', display: 'block' }}>THE</span>
        <span style={{ 
          color: 'var(--neon-green)',
          textShadow: '0 0 30px var(--neon-green-glow), 0 0 60px var(--neon-green-subtle)'
        }}>HALL</span>
        <span style={{ fontWeight: 300 }}> OF</span>
        <br />
        <span style={{ 
          color: 'var(--neon-green)',
          textShadow: '0 0 30px var(--neon-green-glow), 0 0 60px var(--neon-green-subtle)'
        }}>ZERO LIMITS</span>
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginTop: '1.5rem',
        marginBottom: '3rem'
      }}>
        Explore New Paths. Find Your Gift.
      </p>

      {/* Enter Button */}
      <button 
        className="btn hex-shape"
        onClick={onEnter}
        style={{
          padding: '1rem 3rem',
          fontSize: '1rem',
          fontWeight: 600,
          background: 'rgba(0, 255, 136, 0.1)',
          animation: 'pulse-glow 2s infinite'
        }}
      >
        ENTER →
      </button>

      {/* Accessible Version Link */}
      <a
        href="https://wakanda-forever-master.dogstudio-dev.co/zerolimits"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'var(--text-secondary)',
          padding: '0.5rem 1rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        }}
      >
        Accessible version →
      </a>
    </div>
  )
}

// Sprite Logo Component
function SpriteLogo() {
  return (
    <svg width="80" height="40" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M60 5L75 15V45L60 55L45 45V15L60 5Z" 
        stroke="var(--neon-green)" 
        strokeWidth="2"
        fill="rgba(0, 255, 136, 0.1)"
      />
      <text 
        x="60" 
        y="35" 
        textAnchor="middle" 
        fill="var(--neon-green)" 
        fontSize="12"
        fontFamily="var(--font-display)"
        letterSpacing="1"
      >
        SPRITE
      </text>
    </svg>
  )
}

// Wakanda Logo Component
function WakandaLogo() {
  return (
    <div style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '0.6rem',
      color: 'var(--text-primary)',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: '0.05em'
    }}>
      <div style={{ fontSize: '0.5rem', opacity: 0.7 }}>MARVEL STUDIOS</div>
      <div style={{ fontWeight: 700 }}>BLACK PANTHER</div>
      <div style={{ 
        fontWeight: 700, 
        color: 'var(--gold-accent)',
        fontSize: '0.7rem'
      }}>WAKANDA FOREVER</div>
      <div style={{ fontSize: '0.4rem', opacity: 0.5 }}>ONLY IN THEATERS</div>
    </div>
  )
}

export default App

