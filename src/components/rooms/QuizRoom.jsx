import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useAppStore, ROOMS } from '../../store/useAppStore'

export default function QuizRoom({ isActive }) {
  const groupRef = useRef()
  const treeRef = useRef()
  const [isTreeHovered, setIsTreeHovered] = useState(false)
  const [isStairsHovered, setIsStairsHovered] = useState(false)
  const [endOfHallButtonHovered, setEndOfHallButtonHovered] = useState(false)
  const openQuiz = useAppStore((state) => state.openQuiz)
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)

  const handleStairsClick = (e) => {
    if (e) e.stopPropagation()
    if (!isActive) return
    setCurrentRoom(ROOMS.THANK_YOU)
  }

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.scale,
        { x: 0.8, y: 0.8, z: 0.8 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Animate tree glow on hover
  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.getElapsedTime()
      // Gentle floating animation
      treeRef.current.position.y = Math.sin(time * 0.5) * 0.1
      
      // Pulse glow when hovered
      if (isTreeHovered) {
        const pulseIntensity = 0.3 + Math.sin(time * 3) * 0.1
        treeRef.current.children.forEach(child => {
          if (child.material && child.material.opacity !== undefined) {
            child.material.opacity = pulseIntensity
          }
        })
      }
    }
  })

  const handleTreeClick = () => {
    // Only open quiz if this room is active
    if (!isActive) return
    openQuiz()
  }

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Central Interactive Tree */}
      <group position={[0, 0, -3]}>
        {/* Table/Platform */}
        <QuizTable />

        {/* Interactive Tree */}
        <group 
          ref={treeRef}
          position={[0, 1.5, 0]}
          onClick={handleTreeClick}
          onPointerOver={() => {
            if (!isActive) return
            setIsTreeHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            if (!isActive) return
            setIsTreeHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Main Tree - Large Triangle */}
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[1.8, 3.5, 4]} />
            <meshBasicMaterial 
              color={isTreeHovered ? "#00ffaa" : "#00ff88"}
              transparent
              opacity={isTreeHovered ? 0.5 : 0.4}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Second Layer - Smaller Triangle */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[1.4, 2.2, 4]} />
            <meshBasicMaterial 
              color={isTreeHovered ? "#00ffaa" : "#00ff88"}
              transparent
              opacity={isTreeHovered ? 0.45 : 0.35}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Base Layer */}
          <mesh position={[0, -1, 0]}>
            <coneGeometry args={[1.6, 1.5, 4]} />
            <meshBasicMaterial 
              color={isTreeHovered ? "#00ffaa" : "#00ff88"}
              transparent
              opacity={isTreeHovered ? 0.4 : 0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Tree Trunk */}
          <mesh position={[0, -2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
            <meshStandardMaterial 
              color="#5a4020"
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>

          {/* Glow ring at base */}
          <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={isTreeHovered ? 0.4 : 0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Floating particles around tree when hovered */}
          {isTreeHovered && (
            <TreeParticles />
          )}
        </group>

        {/* Light beam from table */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 1.2, 1.5, 16, 1, true]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={isTreeHovered ? 0.25 : 0.15}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Take the Quiz Button - Only visible when Quiz Room is active */}
      {isActive && (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
          <group position={[3, 1.5, -3]}>
            <Html 
              center 
              distanceFactor={6}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: isActive ? 'auto' : 'none' }}
            >
              <button 
                className="quiz-3d-button"
                onClick={handleTreeClick}
                onMouseEnter={() => setIsTreeHovered(true)}
                onMouseLeave={() => setIsTreeHovered(false)}
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(0, 255, 136, 0.7)',
                  color: '#fff',
                  padding: '18px 36px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: isActive ? 'flex' : 'none',
                  alignItems: 'center',
                  gap: '14px',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease',
                  clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>TAKE THE QUIZ</span>
              </button>
            </Html>
          </group>
        </Float>
      )}

      {/* Room decorations - Plants */}
      <group position={[-5, -2, -2]}>
        <PottedPlant scale={1.2} />
      </group>
      <group position={[5, -2, -2]}>
        <PottedPlant scale={1} />
      </group>
      <group position={[-3, -2, -6]}>
        <PottedPlant scale={0.8} />
      </group>
      <group position={[3, -2, -6]}>
        <PottedPlant scale={0.9} />
      </group>

      {/* Small decorative trees around the main tree */}
      <SmallTree position={[-6, -2, -4]} scale={0.4} />
      <SmallTree position={[-5, -2, -5]} scale={0.35} />
      <SmallTree position={[-4.5, -2, -6]} scale={0.45} />
      <SmallTree position={[6, -2, -4]} scale={0.4} />
      <SmallTree position={[5, -2, -5]} scale={0.38} />
      <SmallTree position={[4.5, -2, -6]} scale={0.42} />
      <SmallTree position={[-3, -2, -8]} scale={0.3} />
      <SmallTree position={[3, -2, -8]} scale={0.32} />
      <SmallTree position={[0, -2, -9]} scale={0.35} />

      {/* Spiral staircase - Clickable to Thank You Room */}
      <group position={[8, -2, 0]}>
        <SpiralStairs 
          isHovered={isStairsHovered}
          onClick={handleStairsClick}
          onPointerOver={() => {
            if (!isActive) return
            setIsStairsHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            if (!isActive) return
            setIsStairsHovered(false)
            document.body.style.cursor = 'auto'
          }}
        />
        
        {/* End of Hall Button above stairs */}
        {isActive && (
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
            <group position={[-2, 4, 0]}>
              <Html 
                center 
                distanceFactor={6}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                <button 
                  onClick={handleStairsClick}
                  onMouseEnter={() => {
                    setEndOfHallButtonHovered(true)
                    setIsStairsHovered(true)
                  }}
                  onMouseLeave={() => {
                    setEndOfHallButtonHovered(false)
                    setIsStairsHovered(false)
                  }}
                  style={{
                    background: 'transparent',
                    border: '3px solid rgba(0, 255, 136, 0.7)',
                    color: '#fff',
                    padding: '18px 46px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.4rem',
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
                    boxShadow: endOfHallButtonHovered ? '0 0 40px rgba(0, 255, 136, 0.5)' : '0 0 25px rgba(0, 255, 136, 0.25)',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>END OF HALL</span>
                </button>
              </Html>
            </group>
          </Float>
        )}
      </group>

      {/* Curved architectural element */}
      <mesh position={[6, 3, -5]} rotation={[0, -0.3, 0]}>
        <torusGeometry args={[3, 0.1, 8, 32, Math.PI / 2]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>

      {/* Glowing circular patterns on floor */}
      <group position={[0, -1.98, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Outer ring */}
        <mesh>
          <ringGeometry args={[4, 4.1, 64]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Inner ring */}
        <mesh>
          <ringGeometry args={[2.5, 2.6, 64]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Center glow */}
        <mesh>
          <circleGeometry args={[1.5, 64]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Decorative lines */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.02, 4]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 20]} />
        <meshStandardMaterial 
          color="#141a14"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  )
}

// Tree Particles Component
function TreeParticles() {
  const particlesRef = useRef()
  const count = 20

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime()
      particlesRef.current.rotation.y = time * 0.3
    }
  })

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 1.5 + Math.random() * 0.5
      const height = Math.random() * 3 - 0.5
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.05}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Small Tree Component
function SmallTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Tree body */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.8, 2, 4]} />
        <meshBasicMaterial 
          color="#1a4a2a"
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshBasicMaterial 
          color="#1a4a2a"
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 6]} />
        <meshStandardMaterial color="#3a2515" roughness={0.9} />
      </mesh>
    </group>
  )
}

function QuizTable() {
  return (
    <group position={[0, -1, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.5, 0.15, 1.5]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Table surface decoration */}
      <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.2]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Table legs */}
      {[[-0.9, 0.4, -0.5], [0.9, 0.4, -0.5], [-0.9, 0.4, 0.5], [0.9, 0.4, 0.5]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial 
            color="#c4a35a"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Decorative cross beam */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.08, 0.08]} />
        <meshStandardMaterial color="#8b5a2b" metalness={0.5} />
      </mesh>
    </group>
  )
}

function HologramText({ position }) {
  return (
    <group position={position}>
      {/* Simulated floating text lines */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <planeGeometry args={[1.5 - i * 0.3, 0.15]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.6 - i * 0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

function PottedPlant({ scale = 1 }) {
  return (
    <group scale={scale}>
      {/* Large planter box */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial 
          color="#2a1f15"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.3, 0.1, 1.3]} />
        <meshStandardMaterial color="#1a1508" roughness={0.95} />
      </mesh>

      {/* Plant leaves */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * 0.3,
              1.5 + Math.random() * 0.5,
              Math.sin(angle) * 0.3
            ]}
            rotation={[
              0.3 + Math.random() * 0.3,
              angle,
              0
            ]}
          >
            <coneGeometry args={[0.12, 0.8, 3]} />
            <meshStandardMaterial 
              color={`hsl(${115 + Math.random() * 20}, 55%, ${28 + Math.random() * 12}%)`}
              roughness={0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function SpiralStairs({ isHovered = false, onClick, onPointerOver, onPointerOut }) {
  const stepsRef = useRef()

  // Wrapped handlers with stopPropagation to prevent clicks from going to other rooms
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick(e)
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (onPointerOver) onPointerOver(e)
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    if (onPointerOut) onPointerOut(e)
  }

  return (
    <group>
      {/* Invisible hit box to capture all clicks on the stairs area */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, 0, 0]}
        visible={false}
      >
        <cylinderGeometry args={[2.5, 2.5, 9, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Central pole */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
        <meshStandardMaterial 
          color={isHovered ? "#a07040" : "#8b5a2b"}
          metalness={0.5}
          emissive={isHovered ? "#00ff88" : "#000000"}
          emissiveIntensity={isHovered ? 0.15 : 0}
        />
      </mesh>

      {/* Spiral steps */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2.5
        const y = -3 + i * 0.6
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 1, y, Math.sin(angle) * 1]}
            rotation={[0, -angle, 0]}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <boxGeometry args={[1.2, 0.1, 0.5]} />
            <meshStandardMaterial 
              color={isHovered ? "#d4b36a" : "#c4a35a"}
              metalness={0.5}
              emissive={isHovered ? "#00ff88" : "#000000"}
              emissiveIntensity={isHovered ? 0.2 : 0}
            />
          </mesh>
        )
      })}

      {/* Railing with neon accent */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2.5
        const y = -3 + i * 0.6
        return (
          <mesh 
            key={`rail-${i}`}
            position={[Math.cos(angle) * 1.3, y + 0.5, Math.sin(angle) * 1.3]}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[isHovered ? 0.08 : 0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent
              opacity={isHovered ? 1 : 0.8}
            />
          </mesh>
        )
      })}

      {/* Hover glow ring at base */}
      {isHovered && (
        <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2, 32]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

