import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import './LoadingScreen.css'

export default function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const progressRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Simulate loading progress
    const duration = 3000 // 3 seconds total load time
    const interval = 30
    const increment = 100 / (duration / interval)
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment + (Math.random() * 2)
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      setIsComplete(true)
      
      // Animate out
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.5,
        onComplete: () => {
          onLoadComplete?.()
        }
      })
    }
  }, [progress, isComplete, onLoadComplete])

  // Animate progress bar
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${Math.min(progress, 100)}%`,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, [progress])

  return (
    <AnimatePresence>
      <motion.div 
        ref={containerRef}
        className="loading-screen wakanda-pattern"
        initial={{ opacity: 1 }}
      >
        {/* Geometric Pattern Overlay */}
        <div className="loading-pattern-overlay" />
        
        {/* Animated Lines */}
        <div className="loading-lines">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="loading-line"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1, 
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                top: `${20 + i * 15}%`,
              }}
            />
          ))}
        </div>

        {/* Center Content */}
        <div className="loading-content">
          {/* Brand Logos */}
          <motion.div 
            className="loading-logos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="sprite-logo">
              <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M50 5L70 15V35L50 45L30 35V15L50 5Z" 
                  stroke="var(--neon-green)" 
                  strokeWidth="1.5"
                  fill="rgba(0, 255, 136, 0.05)"
                />
                <text 
                  x="50" 
                  y="28" 
                  textAnchor="middle" 
                  fill="var(--neon-green)" 
                  fontSize="8"
                  fontFamily="var(--font-display)"
                >
                  SPRITE
                </text>
                <text 
                  x="50" 
                  y="36" 
                  textAnchor="middle" 
                  fill="var(--text-muted)" 
                  fontSize="4"
                  fontFamily="var(--font-body)"
                >
                  ZERO SUGAR
                </text>
              </svg>
            </div>
            
            <span className="logo-divider">×</span>
            
            <div className="wakanda-logo">
              <div className="wakanda-studio">MARVEL STUDIOS</div>
              <div className="wakanda-title">BLACK PANTHER</div>
              <div className="wakanda-subtitle">WAKANDA FOREVER</div>
              <div className="wakanda-theaters">ONLY IN THEATERS</div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div 
            className="loading-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="title-the">THE</span>
            <span className="title-hall glow-text">HALL</span>
            <span className="title-of">OF</span>
            <br />
            <span className="title-zero glow-text">ZERO</span>
            <span className="title-limits glow-text"> LIMITS</span>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            className="loading-progress-container"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="progress-bar">
              <div 
                ref={progressRef}
                className="progress-fill"
              />
            </div>
            <div className="progress-text">
              <span className="progress-label">LOADING EXPERIENCE</span>
              <span className="progress-value">{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="loading-decorations">
            <div className="decoration-corner top-left" />
            <div className="decoration-corner top-right" />
            <div className="decoration-corner bottom-left" />
            <div className="decoration-corner bottom-right" />
          </div>
        </div>

        {/* Scan Line Effect */}
        <div className="scan-line" />
        
        {/* Particle Effect */}
        <div className="loading-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ 
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -20
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

