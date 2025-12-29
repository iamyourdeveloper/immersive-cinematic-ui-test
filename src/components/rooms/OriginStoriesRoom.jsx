import { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { CREATORS, useAppStore, ROOMS } from '../../store/useAppStore'

// Centralized hover state manager - prevents race conditions between portraits
const hoverState = {
  activeIndex: null,
  timeout: null,
  
  enter(index, setHoveredCreator) {
    // Clear any pending timeout
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.activeIndex = index
    setHoveredCreator(index)
    document.body.style.cursor = 'pointer'
  },
  
  leave(index) {
    // Only schedule hide if this is still the active portrait
    if (this.activeIndex !== index) return
    
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    
    this.timeout = setTimeout(() => {
      const store = useAppStore.getState()
      // Only hide if no portrait is being hovered and card is not hovered
      if (this.activeIndex === index && !store.isCardHovered) {
        this.activeIndex = null
        store.clearHoveredCreator()
        document.body.style.cursor = 'default'
      }
      this.timeout = null
    }, 300)
  },
  
  reset() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.activeIndex = null
  }
}

export default function OriginStoriesRoom({ isActive }) {
  const groupRef = useRef()

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.position,
        { z: -5 },
        { z: 0, duration: 1.2, ease: 'power2.out' }
      )
      gsap.fromTo(groupRef.current.rotation,
        { y: 0.2 },
        { y: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Clean up hover state when room becomes inactive
  useEffect(() => {
    if (!isActive) {
      hoverState.reset()
    }
    return () => hoverState.reset()
  }, [isActive])

  const creators = CREATORS.originStories

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Video Portrait Displays */}
      <group position={[0, 0, -5]}>
        {creators.map((creator, i) => (
          <HolographicPortrait 
            key={creator.id}
            position={[(i - 1) * 4, 0, i === 1 ? -1 : 0]}
            rotation={[0, i === 0 ? 0.15 : i === 2 ? -0.15 : 0, 0]}
            creator={creator}
            index={i}
            isActive={isActive}
          />
        ))}
      </group>

      {/* Sprite promotional banner on right - Inspiration Garden portal */}
      <group position={[10, 0, -3]}>
        <PromoBanner isActive={isActive} />
      </group>

      {/* Decorative architectural elements */}
      <group position={[0, 4, -8]}>
        {/* Curved ceiling beam */}
        <mesh>
          <torusGeometry args={[8, 0.15, 8, 32, Math.PI * 0.8]} />
          <meshStandardMaterial 
            color="#8b5a2b"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Floor patterns */}
      <mesh position={[0, -2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial 
          color="#141a14"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Floor neon accents */}
      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, 15]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>

      {/* Ambient particles */}
      <AmbientSparkles />
    </group>
  )
}

function HolographicPortrait({ position, rotation, creator, index, isActive }) {
  const frameRef = useRef()
  const glowRef = useRef()
  const scanLineRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  
  const setHoveredCreator = useAppStore((state) => state.setHoveredCreator)
  const hoveredCreator = useAppStore((state) => state.hoveredCreator)

  // Sync local hover state with global state
  useEffect(() => {
    setIsHovered(hoveredCreator === index)
  }, [hoveredCreator, index])

  // Animate the holographic effect
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (glowRef.current) {
      // Enhanced glow on hover
      const baseOpacity = isHovered ? 0.5 : 0.3
      const pulseAmount = isHovered ? 0.15 : 0.1
      glowRef.current.material.opacity = baseOpacity + Math.sin(time * 2 + index) * pulseAmount
    }
    
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(time + index) * 1.5
    }
  })

  const handlePointerEnter = useCallback(() => {
    if (!isActive) return
    hoverState.enter(index, setHoveredCreator)
  }, [isActive, index, setHoveredCreator])

  const handlePointerLeave = useCallback(() => {
    hoverState.leave(index)
  }, [index])

  // Calculate hit area size - middle door needs larger hit area due to z-offset
  const hitAreaWidth = index === 1 ? 4.5 : 3.5
  const hitAreaHeight = index === 1 ? 6 : 5.5
  const hitAreaDepth = index === 1 ? 3 : 1.5

  return (
    <group position={position} rotation={rotation}>
      {/* Interactive hit area - larger than visible portrait for easier interaction */}
      {/* Middle door (index 1) has larger hit area to compensate for z-offset */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        visible={false}
      >
        <boxGeometry args={[hitAreaWidth, hitAreaHeight, hitAreaDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Portrait frame */}
      <mesh ref={frameRef}>
        <boxGeometry args={[2.5, 4, 0.1]} />
        <meshStandardMaterial 
          color={isHovered ? "#0f2a0f" : "#0a1a0a"}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Holographic screen */}
      <mesh ref={glowRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[2.3, 3.8]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.5 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Screen scan line effect */}
      <mesh ref={scanLineRef} position={[0, 0, 0.12]}>
        <planeGeometry args={[2.3, 0.02]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Frame border neon - enhanced on hover */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.6, 4.1]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner accents - brighter on hover */}
      {[[-1, 1.7], [1, 1.7], [-1, -1.7], [1, -1.7]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.08]}>
          <boxGeometry args={[0.2, 0.2, 0.02]} />
          <meshBasicMaterial 
            color="#00ff88" 
            transparent
            opacity={isHovered ? 1 : 0.8}
          />
        </mesh>
      ))}

      {/* Name plate at bottom */}
      <group position={[0, -1.5, 0.15]}>
        <mesh>
          <planeGeometry args={[2, 0.8]} />
          <meshBasicMaterial 
            color="#001a00"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Watch button indicator - only visible on hover */}
      <group position={[0, 0.5, 0.2]}>
        <mesh>
          <boxGeometry args={[1, 0.4, 0.05]} />
          <meshBasicMaterial 
            color="#0a1a0a"
            transparent
            opacity={isHovered ? 0.95 : 0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.1, 0.5]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={isHovered ? 0.4 : 0.2}
          />
        </mesh>
      </group>

      {/* Connector line to hotspot */}
      <mesh position={[0, -0.3, 0.15]}>
        <planeGeometry args={[0.01, 1]} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent 
          opacity={isHovered ? 0.8 : 0.5} 
        />
      </mesh>

      {/* Hotspot hexagon */}
      <mesh position={[0, -1, 0.15]}>
        <circleGeometry args={[0.15, 6]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>

      {/* Additional hover glow effect */}
      {isHovered && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[3, 4.5]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

function PromoBanner({ position = [0, 0, 0], isActive }) {
  const bannerRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)

  useFrame((state) => {
    if (bannerRef.current) {
      const time = state.clock.getElapsedTime()
      const baseOpacity = isHovered ? 0.7 : 0.5
      bannerRef.current.material.opacity = baseOpacity + Math.sin(time * 1.5) * 0.2
    }
  })

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    setCurrentRoom(ROOMS.INSPIRATION_GARDEN)
  }, [setCurrentRoom])

  const handlePointerEnter = useCallback((e) => {
    e.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerLeave = useCallback((e) => {
    e.stopPropagation()
    setIsHovered(false)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <group position={position}>
      {/* Inspiration Garden Button - Above the banner */}
      {isActive && (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
          <group position={[0, 3.5, 0.5]}>
            <Html 
              center 
              distanceFactor={6}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: isActive ? 'auto' : 'none' }}
            >
              <button 
                className="inspiration-garden-button"
                onClick={() => setCurrentRoom(ROOMS.INSPIRATION_GARDEN)}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                style={{
                  background: 'transparent',
                  border: '3px solid rgba(0, 255, 136, 0.7)',
                  color: '#fff',
                  padding: '28px 56px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: isActive ? 'flex' : 'none',
                  alignItems: 'center',
                  gap: '18px',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease',
                  clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)',
                  boxShadow: buttonHovered ? '0 0 40px rgba(0, 255, 136, 0.5)' : '0 0 25px rgba(0, 255, 136, 0.25)',
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>INSPIRATION GARDEN</span>
              </button>
            </Html>
          </group>
        </Float>
      )}

      {/* Banner frame - tall portal shape - CLICKABLE */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[2, 5, 0.1]} />
        <meshStandardMaterial 
          color={isHovered ? "#0f2a0f" : "#0a1a0a"}
          metalness={0.3}
          emissive={isHovered ? "#00ff88" : "#000000"}
          emissiveIntensity={isHovered ? 0.15 : 0}
        />
      </mesh>

      {/* Banner glow */}
      <mesh ref={bannerRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[1.8, 4.8]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.7 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Neon frame outline */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.1, 5.1]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.35 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sprite logo area */}
      <mesh position={[0, -1.8, 0.15]}>
        <ringGeometry args={[0.2, 0.3, 6]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* Additional hover glow effect */}
      {isHovered && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.5, 5.5]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

function AmbientSparkles() {
  const particlesRef = useRef()
  const count = 50

  const positions = useRef(
    [...Array(count)].flatMap(() => [
      (Math.random() - 0.5) * 20,
      Math.random() * 8 - 2,
      (Math.random() - 0.5) * 15
    ])
  ).current

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime()
      particlesRef.current.rotation.y = time * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
