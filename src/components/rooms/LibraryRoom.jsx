import { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { CREATORS, useAppStore } from '../../store/useAppStore'

// Centralized hover state manager for Library room - prevents race conditions between portraits
const libraryHoverState = {
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

export default function LibraryRoom({ isActive }) {
  const groupRef = useRef()

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.scale,
        { x: 0.9, y: 0.9, z: 0.9 },
        { x: 1, y: 1, z: 1, duration: 1, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Clean up hover state when room becomes inactive
  useEffect(() => {
    if (!isActive) {
      libraryHoverState.reset()
    }
    return () => libraryHoverState.reset()
  }, [isActive])

  const creators = CREATORS.library

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Library Video Portraits - Similar to Origin Stories but different layout */}
      <group position={[0, 0, -5]}>
        {creators.map((creator, i) => (
          <LibraryPortrait 
            key={creator.id}
            position={[(i - 1) * 4.5, 0, 0]}
            creator={creator}
            index={i}
            isActive={isActive}
          />
        ))}
      </group>

      {/* Architectural bookshelves on sides */}
      <Bookshelf position={[-10, 0, -5]} />
      <Bookshelf position={[10, 0, -5]} />

      {/* Floor with geometric pattern */}
      <group position={[0, -2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 15]} />
          <meshStandardMaterial 
            color="#0f140f"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Diamond pattern overlay */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            position={[(i - 2) * 4, 0.01, -2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
          >
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial 
              color="#c4a35a"
              transparent
              opacity={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Decorative ceiling beams */}
      <group position={[0, 6, -5]}>
        {[-8, -4, 0, 4, 8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 15]} />
            <meshStandardMaterial 
              color="#8b5a2b"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function LibraryPortrait({ position, creator, index, isActive }) {
  const portraitRef = useRef()
  const glowRef = useRef()
  const scanLineRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  
  const setHoveredCreator = useAppStore((state) => state.setHoveredCreator)
  const hoveredCreator = useAppStore((state) => state.hoveredCreator)

  // Sync local hover state with global state
  useEffect(() => {
    setIsHovered(hoveredCreator === index)
  }, [hoveredCreator, index])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (glowRef.current) {
      // Enhanced glow on hover
      const baseOpacity = isHovered ? 0.5 : 0.25
      const pulseAmount = isHovered ? 0.15 : 0.1
      glowRef.current.material.opacity = baseOpacity + Math.sin(time * 1.5 + index * 0.5) * pulseAmount
    }
    
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(time + index) * 1.8
    }
  })

  const handlePointerEnter = useCallback(() => {
    if (!isActive) return
    libraryHoverState.enter(index, setHoveredCreator)
  }, [isActive, index, setHoveredCreator])

  const handlePointerLeave = useCallback(() => {
    libraryHoverState.leave(index)
  }, [index])

  // Calculate hit area size
  const hitAreaWidth = 3.5
  const hitAreaHeight = 6
  const hitAreaDepth = 1.5

  return (
    <group ref={portraitRef} position={position}>
      {/* Interactive hit area - larger than visible portrait for easier interaction */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        visible={false}
      >
        <boxGeometry args={[hitAreaWidth, hitAreaHeight, hitAreaDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Portrait frame - taller, thinner */}
      <mesh>
        <boxGeometry args={[2.2, 4.5, 0.15]} />
        <meshStandardMaterial 
          color={isHovered ? "#0f2a0f" : "#0a150a"}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Inner frame border */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2, 4.3, 0.02]} />
        <meshStandardMaterial 
          color={isHovered ? "#1f3a1f" : "#1a2a1a"}
          metalness={0.3}
        />
      </mesh>

      {/* Holographic display */}
      <mesh ref={glowRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[1.9, 4.2]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.5 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Screen scan line effect */}
      <mesh ref={scanLineRef} position={[0, 0, 0.12]}>
        <planeGeometry args={[1.9, 0.02]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Frame neon accent - enhanced on hover */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2.1, 4.4]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.25 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top decorative element */}
      <mesh position={[0, 2.5, 0.1]}>
        <boxGeometry args={[0.8, 0.15, 0.05]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>

      {/* Bottom decorative element */}
      <mesh position={[0, -2.5, 0.1]}>
        <boxGeometry args={[0.8, 0.15, 0.05]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>

      {/* Corner accents - brighter on hover */}
      {[[-0.9, 2], [0.9, 2], [-0.9, -2], [0.9, -2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.1]}>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
          <meshBasicMaterial 
            color="#00ff88" 
            transparent
            opacity={isHovered ? 1 : 0.8}
          />
        </mesh>
      ))}

      {/* Watch button indicator - more visible on hover */}
      <group position={[0, 0.8, 0.15]}>
        <mesh>
          <boxGeometry args={[1.2, 0.4, 0.05]} />
          <meshBasicMaterial 
            color="#001a00"
            transparent
            opacity={isHovered ? 0.95 : 0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.3, 0.5]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={isHovered ? 0.4 : 0.2}
          />
        </mesh>
      </group>

      {/* Name plate at bottom */}
      <group position={[0, -1.6, 0.15]}>
        <mesh>
          <planeGeometry args={[1.8, 0.8]} />
          <meshBasicMaterial 
            color="#001a00"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Connector and hotspot */}
      <mesh position={[0, -0.2, 0.12]}>
        <planeGeometry args={[0.01, 0.8]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={isHovered ? 0.8 : 0.6} />
      </mesh>

      <mesh position={[0, -0.7, 0.12]}>
        <circleGeometry args={[0.12, 6]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={isHovered ? 1 : 0.9} />
      </mesh>

      {/* Additional hover glow effect */}
      {isHovered && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.8, 5]} />
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

function Bookshelf({ position }) {
  return (
    <group position={position}>
      {/* Shelf frame */}
      <mesh>
        <boxGeometry args={[3, 6, 0.8]} />
        <meshStandardMaterial 
          color="#2a1f15"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Shelf dividers */}
      {[-2, -0.5, 1, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2.8, 0.1, 0.7]} />
          <meshStandardMaterial 
            color="#3d2b1f"
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Book representations */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, row) => (
        [...Array(4)].map((_, i) => (
          <mesh 
            key={`${row}-${i}`} 
            position={[-1 + i * 0.6, y + 0.3, 0]}
          >
            <boxGeometry args={[0.4, 0.6, 0.5]} />
            <meshStandardMaterial 
              color={`hsl(${Math.random() * 40 + 10}, 40%, ${20 + Math.random() * 20}%)`}
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        ))
      ))}
    </group>
  )
}

