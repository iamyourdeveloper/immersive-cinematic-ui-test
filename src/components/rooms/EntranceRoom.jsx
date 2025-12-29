import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox, Html, Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useAppStore, ROOMS } from '../../store/useAppStore'

export default function EntranceRoom({ isActive, onEnter }) {
  const setCurrentRoom = useAppStore(state => state.setCurrentRoom)
  const [hovered, setHovered] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const groupRef = useRef()
  const doorRef = useRef()
  const glowRef = useRef()

  // Animate entrance when room becomes active
  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.scale,
        { x: 0.8, y: 0.8, z: 0.8 },
        { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.out' }
      )
      gsap.fromTo(groupRef.current.position,
        { y: -2 },
        { y: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Animate door glow
  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.getElapsedTime()
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.2
    }
  })

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Main Door Frame - Clickable Gate */}
      <group position={[0, 0, -5]}>
        {/* Door arch frame */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[5, 8, 0.5]} />
          <meshStandardMaterial 
            color="#1a1f1a"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Door surface with Wakanda pattern - CLICKABLE */}
        <mesh 
          ref={doorRef} 
          position={[0, 2, 0.3]}
          onClick={(e) => {
            e.stopPropagation()
            if (!isActive) return
            setCurrentRoom(ROOMS.LOBBY)
          }}
          onPointerEnter={(e) => {
            e.stopPropagation()
            if (!isActive) return
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={(e) => {
            e.stopPropagation()
            if (!isActive) return
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <boxGeometry args={[4, 7, 0.3]} />
          <meshStandardMaterial 
            color={hovered ? "#a06830" : "#8b5a2b"}
            metalness={0.6}
            roughness={0.4}
            emissive={hovered ? "#00ff88" : "#000000"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>

        {/* Door pattern - geometric lines */}
        <group position={[0, 2, 0.5]}>
          {/* Vertical center line */}
          <mesh>
            <boxGeometry args={[0.1, 6, 0.1]} />
            <meshStandardMaterial color="#c4a35a" metalness={0.7} />
          </mesh>
          
          {/* Horizontal lines */}
          {[-1.5, 0, 1.5].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[3, 0.08, 0.1]} />
              <meshStandardMaterial color="#c4a35a" metalness={0.7} />
            </mesh>
          ))}

          {/* Center emblem */}
          <mesh position={[0, 0, 0.1]}>
            <ringGeometry args={[0.3, 0.5, 6]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Neon glow outline */}
        <mesh ref={glowRef} position={[0, 2, 0.6]}>
          <planeGeometry args={[4.2, 7.2]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Arch neon accent */}
        <mesh position={[0, 5.5, 0.4]} rotation={[0, 0, 0]}>
          <torusGeometry args={[2.2, 0.03, 8, 32, Math.PI]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      </group>

      {/* Steps leading to door */}
      <group position={[0, -2, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.3, i * -1.5]}>
            <boxGeometry args={[6 - i * 0.5, 0.3, 1.5]} />
            <meshStandardMaterial 
              color="#1a1f1a"
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        ))}
        
        {/* Step neon accents */}
        {[0, 1, 2].map((i) => (
          <mesh key={`neon-${i}`} position={[0, i * 0.3 + 0.16, i * -1.5 + 0.75]}>
            <boxGeometry args={[6 - i * 0.5, 0.02, 0.02]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        ))}
      </group>

      {/* Side pillars */}
      {[-3.5, 3.5].map((x, i) => (
        <group key={i} position={[x, 0, -3]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.5, 8, 8]} />
            <meshStandardMaterial 
              color="#2a352a"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          
          {/* Pillar neon ring */}
          <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.02, 8, 32]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>
      ))}

      {/* Decorative plants */}
      <group position={[-5, -2, 2]}>
        <PlantDecoration />
      </group>
      <group position={[5, -2, 2]}>
        <PlantDecoration />
      </group>

      {/* Floor neon lines */}
      <mesh position={[0, -1.9, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 8]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </mesh>

      {/* Enter Lobby Button - Right side of gate - Only render when room is active */}
      {isActive && (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
          <group position={[5.5, 1, -1]}>
            <Html 
              center 
              distanceFactor={6}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: isActive ? 'auto' : 'none' }}
            >
              <button 
                className="enter-lobby-button"
                onClick={() => setCurrentRoom(ROOMS.LOBBY)}
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
                <span>ENTER LOBBY</span>
              </button>
            </Html>
          </group>
        </Float>
      )}
    </group>
  )
}

function PlantDecoration() {
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.6, 8]} />
        <meshStandardMaterial color="#1a1f1a" metalness={0.3} />
      </mesh>
      
      {/* Leaves */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.sin(i / 6 * Math.PI * 2) * 0.3,
            0.8 + Math.random() * 0.5,
            Math.cos(i / 6 * Math.PI * 2) * 0.3
          ]}
          rotation={[
            Math.random() * 0.5,
            i / 6 * Math.PI * 2,
            Math.random() * 0.3 - 0.5
          ]}
        >
          <coneGeometry args={[0.15, 0.8, 3]} />
          <meshStandardMaterial 
            color={`hsl(${120 + Math.random() * 15}, 50%, 30%)`}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

