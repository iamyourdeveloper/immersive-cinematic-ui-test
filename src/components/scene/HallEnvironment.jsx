import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Wakanda-inspired architectural elements
export default function HallEnvironment() {
  return (
    <group>
      {/* Floor */}
      <Floor />
      
      {/* Walls */}
      <Walls />
      
      {/* Columns */}
      <Columns />
      
      {/* Ceiling Structure */}
      <Ceiling />
      
      {/* Neon Accent Lines */}
      <NeonAccents />
      
      {/* Foliage Decorations */}
      <Foliage />
    </group>
  )
}

// Marble-like floor with geometric patterns
function Floor() {
  const floorRef = useRef()
  
  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a1f1a',
      metalness: 0.3,
      roughness: 0.7,
    })
  }, [])

  return (
    <group>
      {/* Main floor */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50, 32, 32]} />
        <meshStandardMaterial {...floorMaterial} />
      </mesh>
      
      {/* Floor pattern overlay */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1.99, 0]}
      >
        <ringGeometry args={[3, 4, 6]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
      </mesh>
      
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1.98, 0]}
      >
        <ringGeometry args={[5, 5.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Architectural walls with Wakanda patterns
function Walls() {
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0f140f',
      metalness: 0.2,
      roughness: 0.8,
    })
  }, [])

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 5, -15]} receiveShadow>
        <boxGeometry args={[40, 15, 0.5]} />
        <primitive object={wallMaterial} />
      </mesh>
      
      {/* Side walls */}
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 15, 0.5]} />
        <primitive object={wallMaterial} />
      </mesh>
      
      <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 15, 0.5]} />
        <primitive object={wallMaterial} />
      </mesh>
    </group>
  )
}

// Wakanda-style columns
function Columns() {
  const columnPositions = useMemo(() => [
    [-8, 0, -10],
    [8, 0, -10],
    [-12, 0, -5],
    [12, 0, -5],
    [-15, 0, 5],
    [15, 0, 5],
  ], [])

  return (
    <group>
      {columnPositions.map((pos, i) => (
        <Column key={i} position={pos} />
      ))}
    </group>
  )
}

function Column({ position }) {
  const columnRef = useRef()
  
  return (
    <group position={position}>
      {/* Main column */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 12, 8]} />
        <meshStandardMaterial 
          color="#2a352a" 
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Column base */}
      <mesh position={[0, -5.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial 
          color="#c4a35a" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Column capital */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial 
          color="#c4a35a" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Neon accent ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.55, 0.02, 8, 32]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
    </group>
  )
}

// Dome/ceiling structure
function Ceiling() {
  return (
    <group position={[0, 10, 0]}>
      {/* Dome frame */}
      <mesh>
        <sphereGeometry args={[15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#1a1f1a"
          side={THREE.BackSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Geometric pattern beams */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          rotation={[0, (Math.PI / 4) * i, Math.PI / 6]}
        >
          <boxGeometry args={[0.1, 15, 0.1]} />
          <meshStandardMaterial 
            color="#8b5a2b"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

// Neon accent lighting elements
function NeonAccents() {
  const neonRef = useRef()
  
  useFrame((state) => {
    if (neonRef.current) {
      const t = state.clock.getElapsedTime()
      neonRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = 0.6 + Math.sin(t * 2 + i) * 0.2
        }
      })
    }
  })

  return (
    <group ref={neonRef}>
      {/* Floor accent lines */}
      <mesh position={[0, -1.95, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 20]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      
      {/* Curved wall accents */}
      <mesh position={[-19.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.1, 10]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
      
      <mesh position={[19.7, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.1, 10]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
      
      {/* Decorative arches */}
      {[-10, 0, 10].map((z, i) => (
        <mesh key={i} position={[0, 8, z]}>
          <torusGeometry args={[3, 0.02, 8, 32, Math.PI]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Tropical foliage decorations
function Foliage() {
  const foliagePositions = useMemo(() => [
    [-6, -2, 8],
    [6, -2, 8],
    [-10, -2, 3],
    [10, -2, 3],
    [-4, -2, -8],
    [4, -2, -8],
  ], [])

  return (
    <group>
      {foliagePositions.map((pos, i) => (
        <FoliageCluster key={i} position={pos} scale={0.8 + Math.random() * 0.4} />
      ))}
    </group>
  )
}

function FoliageCluster({ position, scale = 1 }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Simple leaf representations */}
      {[...Array(5)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 1.5,
            Math.random() * 2,
            (Math.random() - 0.5) * 1.5
          ]}
          rotation={[
            Math.random() * 0.5,
            Math.random() * Math.PI * 2,
            Math.random() * 0.3
          ]}
        >
          <coneGeometry args={[0.3, 1.5, 4]} />
          <meshStandardMaterial 
            color={`hsl(${120 + Math.random() * 20}, 60%, ${25 + Math.random() * 15}%)`}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

