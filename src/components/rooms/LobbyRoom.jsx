import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useAppStore, ROOMS } from '../../store/useAppStore'

export default function LobbyRoom({ isActive }) {
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)
  const groupRef = useRef()
  const treeRef = useRef()
  const leavesRef = useRef()

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.scale,
        { x: 0.9, y: 0.9, z: 0.9 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Animate tree leaves
  useFrame((state) => {
    if (leavesRef.current) {
      const time = state.clock.getElapsedTime()
      leavesRef.current.rotation.y = Math.sin(time * 0.3) * 0.05
    }
  })

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Central Tree - The heart of the lobby */}
      <group ref={treeRef} position={[0, -2, 0]}>
        {/* Tree trunk */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
          <meshStandardMaterial 
            color="#3d2b1f"
            roughness={0.9}
          />
        </mesh>

        {/* Tree branches */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i}
            position={[
              Math.sin(i / 5 * Math.PI * 2) * 0.8,
              3 + i * 0.3,
              Math.cos(i / 5 * Math.PI * 2) * 0.8
            ]}
            rotation={[
              Math.random() * 0.5 - 0.25,
              i / 5 * Math.PI * 2,
              0.5 + Math.random() * 0.3
            ]}
          >
            <cylinderGeometry args={[0.05, 0.1, 1.5, 6]} />
            <meshStandardMaterial color="#3d2b1f" />
          </mesh>
        ))}

        {/* Tree foliage - spherical canopy */}
        <group ref={leavesRef} position={[0, 5, 0]}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <mesh>
              <sphereGeometry args={[3, 16, 16]} />
              <meshStandardMaterial 
                color="#2d5a2d"
                roughness={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>
          </Float>

          {/* Leaf clusters */}
          {[...Array(20)].map((_, i) => {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            const r = 2.8 + Math.random() * 0.5
            return (
              <mesh 
                key={i}
                position={[
                  r * Math.sin(phi) * Math.cos(theta),
                  r * Math.cos(phi),
                  r * Math.sin(phi) * Math.sin(theta)
                ]}
              >
                <sphereGeometry args={[0.3 + Math.random() * 0.3, 6, 6]} />
                <meshStandardMaterial 
                  color={`hsl(${100 + Math.random() * 40}, 50%, ${30 + Math.random() * 15}%)`}
                  roughness={0.9}
                />
              </mesh>
            )
          })}

          {/* Fruit/Lemons on tree */}
          {[...Array(12)].map((_, i) => {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI * 0.7
            const r = 2.5 + Math.random() * 0.3
            return (
              <mesh 
                key={`fruit-${i}`}
                position={[
                  r * Math.sin(phi) * Math.cos(theta),
                  r * Math.cos(phi) - 0.5,
                  r * Math.sin(phi) * Math.sin(theta)
                ]}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial 
                  color={Math.random() > 0.5 ? '#f4d03f' : '#a8d08d'}
                  roughness={0.6}
                  emissive={Math.random() > 0.7 ? '#f4d03f' : '#000000'}
                  emissiveIntensity={0.1}
                />
              </mesh>
            )
          })}
        </group>

        {/* Ground foliage around tree */}
        <group position={[0, 0, 0]}>
          {[...Array(15)].map((_, i) => {
            const angle = (i / 15) * Math.PI * 2
            const radius = 1.5 + Math.random() * 1
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.random() * 0.3,
                  Math.sin(angle) * radius
                ]}
                rotation={[0, angle, Math.random() * 0.3 - 0.15]}
              >
                <coneGeometry args={[0.2, 0.6, 4]} />
                <meshStandardMaterial 
                  color={`hsl(${115 + Math.random() * 20}, 55%, 28%)`}
                  roughness={0.9}
                />
              </mesh>
            )
          })}
        </group>
      </group>

      {/* Sprite Vending/Display Units on sides - Clickable navigation */}
      <SpriteDisplay 
        position={[-6, -1, -3]} 
        rotation={[0, 0.3, 0]} 
        onClick={() => setCurrentRoom(ROOMS.INSPIRATION_GARDEN)}
        label="Inspiration Garden"
        isActive={isActive}
      />
      <SpriteDisplay 
        position={[6, -1, -3]} 
        rotation={[0, -0.3, 0]} 
        onClick={() => setCurrentRoom(ROOMS.ORIGIN_STORIES)}
        label="Origin Stories"
        isActive={isActive}
      />

      {/* Floor decorative ring */}
      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
      
      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.6, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>

      {/* Side archways/portals */}
      <Portal position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Portal position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

function SpriteDisplay({ position, rotation, onClick, label, isActive }) {
  const displayRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)

  useFrame((state) => {
    if (displayRef.current && displayRef.current.children[1]?.material) {
      const time = state.clock.getElapsedTime()
      // Brighter glow when hovered
      const baseOpacity = hovered ? 0.5 : 0.3
      const pulseAmount = hovered ? 0.3 : 0.2
      displayRef.current.children[1].material.opacity = baseOpacity + Math.sin(time * (hovered ? 4 : 2)) * pulseAmount
    }
  })

  const buttonStyle = {
    background: 'rgba(0, 20, 10, 0.85)',
    border: '2px solid rgba(0, 255, 136, 0.7)',
    color: '#fff',
    padding: '18px 36px',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    boxShadow: buttonHovered 
      ? '0 0 30px rgba(0, 255, 136, 0.4), inset 0 0 20px rgba(0, 255, 136, 0.1)' 
      : '0 0 20px rgba(0, 255, 136, 0.2)',
  }

  return (
    <group ref={displayRef} position={position} rotation={rotation}>
      {/* Label Button above display - Only show when room is active */}
      {isActive && (
        <Html
          position={[0, 2.8, 0.5]}
          center
          distanceFactor={8}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        >
          <button
            style={{
              ...buttonStyle,
              display: isActive ? 'flex' : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (onClick) onClick()
            }}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{label}</span>
          </button>
        </Html>
      )}

      {/* Display frame - Clickable */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[2, 4, 0.3]} />
        <meshStandardMaterial 
          color={hovered ? "#2a3a2a" : "#1a1f1a"}
          metalness={0.4}
          roughness={0.6}
          emissive={hovered ? "#00ff88" : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Display screen glow */}
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[1.8, 3.8]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sprite logo placeholder */}
      <mesh position={[0, 0, 0.25]}>
        <ringGeometry args={[0.3, 0.4, 6]} />
        <meshBasicMaterial color={hovered ? "#88ffcc" : "#00ff88"} />
      </mesh>

      {/* Frame neon accent */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[2.1, 4.1]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={hovered ? 0.4 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Portal({ position, rotation }) {
  const portalRef = useRef()

  useFrame((state) => {
    if (portalRef.current) {
      const time = state.clock.getElapsedTime()
      portalRef.current.material.opacity = 0.4 + Math.sin(time * 1.5) * 0.2
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Portal arch frame */}
      <mesh>
        <boxGeometry args={[3, 5, 0.3]} />
        <meshStandardMaterial 
          color="#1a1f1a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Portal opening glow */}
      <mesh ref={portalRef} position={[0, 0, 0.2]}>
        <planeGeometry args={[2.5, 4.5]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Neon arch */}
      <mesh position={[0, 1.5, 0.2]}>
        <torusGeometry args={[1.3, 0.02, 8, 32, Math.PI]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
    </group>
  )
}

