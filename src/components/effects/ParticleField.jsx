import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 200 }) {
  const meshRef = useRef()
  const lightRef = useRef()

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const opacities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Random positions in a cylinder volume
      const radius = 15 + Math.random() * 10
      const angle = Math.random() * Math.PI * 2
      
      positions[i3] = Math.cos(angle) * radius * Math.random()
      positions[i3 + 1] = (Math.random() - 0.3) * 15 // Height
      positions[i3 + 2] = Math.sin(angle) * radius * Math.random()
      
      // Upward velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = 0.01 + Math.random() * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
      
      // Random sizes
      sizes[i] = 0.02 + Math.random() * 0.05
      
      // Random opacities
      opacities[i] = 0.3 + Math.random() * 0.7
    }

    return { positions, velocities, sizes, opacities }
  }, [count])

  // Animation
  useFrame((state) => {
    if (!meshRef.current) return
    
    const positions = meshRef.current.geometry.attributes.position.array
    const time = state.clock.getElapsedTime()
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Move particles upward
      positions[i3 + 1] += particles.velocities[i3 + 1]
      
      // Add slight horizontal drift
      positions[i3] += Math.sin(time + i) * 0.002
      positions[i3 + 2] += Math.cos(time + i) * 0.002
      
      // Reset particles that go too high
      if (positions[i3 + 1] > 12) {
        positions[i3 + 1] = -3
        positions[i3] = (Math.random() - 0.5) * 25
        positions[i3 + 2] = (Math.random() - 0.5) * 25
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
    
    // Animate the glow effect
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(time * 2) * 0.2
    }
  })

  // Custom shader material for glowing particles
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#00ff88'),
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  }, [])

  return (
    <group>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={particleMaterial} />
      </points>
      
      {/* Ambient particle glow light */}
      <pointLight
        ref={lightRef}
        position={[0, 5, 0]}
        color="#00ff88"
        intensity={0.5}
        distance={30}
        decay={2}
      />
    </group>
  )
}

// Firefly-like particles component
export function FireflyParticles({ count = 30 }) {
  const groupRef = useRef()
  
  const fireflies = useMemo(() => {
    return [...Array(count)].map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 8 - 2,
        (Math.random() - 0.5) * 20
      ],
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2
    }))
  }, [count])
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    groupRef.current.children.forEach((firefly, i) => {
      const data = fireflies[i]
      
      // Floating motion
      firefly.position.y = data.position[1] + Math.sin(time * data.speed + data.offset) * 0.5
      firefly.position.x = data.position[0] + Math.cos(time * data.speed * 0.5 + data.offset) * 0.3
      
      // Pulsing glow
      firefly.material.opacity = 0.4 + Math.sin(time * 3 + data.offset) * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {fireflies.map((ff, i) => (
        <mesh key={i} position={ff.position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

