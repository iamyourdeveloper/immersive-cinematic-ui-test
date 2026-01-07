import { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Float, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export default function ThankYouRoom({ isActive }) {
  const groupRef = useRef()
  const frameRef = useRef()
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null)

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.scale,
        { x: 0.8, y: 0.8, z: 0.8 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power2.out' }
      )
      gsap.fromTo(groupRef.current.rotation,
        { y: -0.2 },
        { y: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Animate frame glow
  useFrame((state) => {
    if (frameRef.current) {
      const time = state.clock.getElapsedTime()
      frameRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.15
    }
  })

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Central Thank You Display Panel */}
      <group position={[0, 1, -5]}>
        {/* Main display frame */}
        <Suspense fallback={<DisplayFrameFallback frameRef={frameRef} />}>
          <DisplayFrame frameRef={frameRef} hoveredIndex={hoveredButtonIndex} />
        </Suspense>

        {/* Wakanda text above */}
        <group position={[0, 4, 0]}>
          <mesh>
            <planeGeometry args={[3, 0.5]} />
            <meshBasicMaterial 
              color="#1a2a1a"
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        {/* Social share buttons */}
        <group position={[0, -1.5, 0.5]}>
          <SocialButtons 
            onButtonHover={setHoveredButtonIndex}
            isActive={isActive}
          />
        </group>
      </group>

      {/* Keep Exploring button */}
      <group position={[0, -3.5, 0]}>
        <mesh>
          <boxGeometry args={[3, 0.6, 0.1]} />
          <meshBasicMaterial 
            color="#0a2a0a"
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[3.1, 0.7]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Button neon border */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3.2, 0.8]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Background environment */}
      <BackgroundEnvironment />

      {/* Floor with neon lines */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 25]} />
        <meshStandardMaterial 
          color="#0f140f"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Floor neon accent lines */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={i} position={[x, -4.95, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 15]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Ambient particles */}
      <ThankYouParticles />
    </group>
  )
}

function DisplayFrame({ frameRef, hoveredIndex }) {
  // Load textures for each button hover state
  const textures = useTexture([
    '/images/showcase/slide-02.png',
    '/images/showcase/sprite-home.png',
    '/images/showcase/github.png'
  ])
  
  // Get the current texture based on hovered index
  const currentTexture = hoveredIndex !== null ? textures[hoveredIndex] : null
  
  return (
    <group>
      {/* Outer hexagonal frame */}
      <mesh>
        <boxGeometry args={[10, 6, 0.2]} />
        <meshStandardMaterial 
          color="#0a150a"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Cut corners to make it hexagonal-ish */}
      {[[-4.5, 2.5], [4.5, 2.5], [-4.5, -2.5], [4.5, -2.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.5, 1.5, 0.3]} />
          <meshStandardMaterial color="#0a150a" />
        </mesh>
      ))}

      {/* Inner display area - shows image on hover */}
      {hoveredIndex !== null && currentTexture && (
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[8.5, 4.8]} />
          <meshBasicMaterial 
            map={currentTexture}
            transparent
            opacity={1}
          />
        </mesh>
      )}

      {/* Inner display area glow - visible when no image */}
      <mesh ref={frameRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[9, 5]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={hoveredIndex !== null ? 0.1 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Frame neon accents */}
      {/* Top line */}
      <mesh position={[0, 2.7, 0.12]}>
        <boxGeometry args={[8, 0.03, 0.02]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* Bottom line */}
      <mesh position={[0, -2.7, 0.12]}>
        <boxGeometry args={[8, 0.03, 0.02]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* Corner accents */}
      {[[-4, 2], [4, 2], [-4, -2], [4, -2]].map(([x, y], i) => (
        <group key={i} position={[x, y, 0.15]}>
          <mesh>
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>
      ))}

      {/* Scan lines effect */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, -2 + i * 0.4, 0.11]}>
          <planeGeometry args={[8.5, 0.01]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Fallback component shown while textures are loading
function DisplayFrameFallback({ frameRef }) {
  return (
    <group>
      {/* Outer hexagonal frame */}
      <mesh>
        <boxGeometry args={[10, 6, 0.2]} />
        <meshStandardMaterial 
          color="#0a150a"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Cut corners to make it hexagonal-ish */}
      {[[-4.5, 2.5], [4.5, 2.5], [-4.5, -2.5], [4.5, -2.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.5, 1.5, 0.3]} />
          <meshStandardMaterial color="#0a150a" />
        </mesh>
      ))}

      {/* Inner display area glow */}
      <mesh ref={frameRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[9, 5]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Frame neon accents */}
      <mesh position={[0, 2.7, 0.12]}>
        <boxGeometry args={[8, 0.03, 0.02]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      <mesh position={[0, -2.7, 0.12]}>
        <boxGeometry args={[8, 0.03, 0.02]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* Corner accents */}
      {[[-4, 2], [4, 2], [-4, -2], [4, -2]].map(([x, y], i) => (
        <group key={i} position={[x, y, 0.15]}>
          <mesh>
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>
      ))}

      {/* Scan lines effect */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, -2 + i * 0.4, 0.11]}>
          <planeGeometry args={[8.5, 0.01]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function SocialButton({ url, offset, onHover, onHoverEnd, isActive }) {
  const [isHovered, setIsHovered] = useState(false)
  const borderRef = useRef()
  const iconRef = useRef()

  useFrame((state) => {
    if (borderRef.current && isHovered) {
      const time = state.clock.getElapsedTime()
      borderRef.current.material.opacity = 0.6 + Math.sin(time * 4) * 0.2
    }
  })

  const handleClick = (e) => {
    if (!isActive) return
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handlePointerOver = (e) => {
    if (!isActive) return
    e.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
    if (onHover) onHover()
  }

  const handlePointerOut = (e) => {
    if (!isActive) return
    e.stopPropagation()
    setIsHovered(false)
    document.body.style.cursor = 'auto'
    if (borderRef.current) {
      borderRef.current.material.opacity = 0.3
    }
    if (onHoverEnd) onHoverEnd()
  }

  return (
    <group position={[offset, 0, 0]}>
      {/* Button background - clickable */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[0.35, 6]} />
        <meshBasicMaterial 
          color={isHovered ? "#2a4a2a" : "#1a2a1a"}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Button border */}
      <mesh 
        ref={borderRef} 
        position={[0, 0, 0.02]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <ringGeometry args={[0.33, 0.38, 6]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.7 : 0.3}
        />
      </mesh>

      {/* Icon placeholder - clickable */}
      <mesh 
        ref={iconRef}
        position={[0, 0, 0.03]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ff88" : "#ffffff"} 
          transparent 
          opacity={isHovered ? 1 : 0.8} 
        />
      </mesh>

      {/* Hover glow effect */}
      {isHovered && (
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.45, 6]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

function SocialButtons({ onButtonHover, isActive }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  
  const buttonData = [
    { url: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits', offset: -1.2, label: 'Sprite x Wakanda Forever (Original)' },
    { url: 'https://www.coca-cola.com/us/en/brands/sprite', offset: 0, label: 'Sprite - Official Home' },
    { url: 'https://github.com/iamyourdeveloper/immersive-cinematic-ui-test', offset: 1.2, label: 'View Repository' }
  ]

  const displayText = hoveredIndex !== null ? buttonData[hoveredIndex].label : 'Hover upon icons below for more content.'

  const handleHover = (index) => {
    setHoveredIndex(index)
    if (onButtonHover) onButtonHover(index)
  }

  const handleHoverEnd = () => {
    setHoveredIndex(null)
    if (onButtonHover) onButtonHover(null)
  }

  return (
    <group>
      {/* "Share the Experience" label / Hover text display */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <planeGeometry args={[4, 0.4]} />
          <meshBasicMaterial 
            color={hoveredIndex !== null ? "#040a04" : "#0a1a0a"}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Neon border on hover */}
        {hoveredIndex !== null && (
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[4.05, 0.45]} />
            <meshBasicMaterial 
              color="#040a04"
              transparent
              opacity={0.15}
            />
          </mesh>
        )}
        {/* Text display */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.18}
          color={hoveredIndex !== null ? "#00ff88" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {displayText}
        </Text>
      </group>

      {/* Social buttons */}
      {buttonData.map((btn, i) => (
        <SocialButton 
          key={i} 
          url={btn.url} 
          offset={btn.offset}
          onHover={() => handleHover(i)}
          onHoverEnd={handleHoverEnd}
          isActive={isActive}
        />
      ))}
    </group>
  )
}

function BackgroundEnvironment() {
  return (
    <group>
      {/* Architectural pillars in background */}
      {[-12, -6, 6, 12].map((x, i) => (
        <group key={i} position={[x, 0, -10]}>
          {/* Pillar */}
          <mesh>
            <boxGeometry args={[1.5, 12, 1.5]} />
            <meshStandardMaterial 
              color="#141a14"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Neon vertical accent */}
          <mesh position={[0.8, 0, 0]}>
            <boxGeometry args={[0.02, 10, 0.02]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Curved ceiling element */}
      <mesh position={[0, 8, -8]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[15, 0.1, 8, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#c4a35a"
          metalness={0.5}
        />
      </mesh>

      {/* Background glow */}
      <mesh position={[0, 3, -12]}>
        <planeGeometry args={[30, 15]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  )
}

function ThankYouParticles() {
  const particlesRef = useRef()
  const count = 60

  const positions = useRef(
    [...Array(count)].flatMap(() => [
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.3) * 15,
      (Math.random() - 0.5) * 20
    ])
  ).current

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime()
      
      const posArray = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        posArray[i3 + 1] += 0.01 // Move up
        
        // Reset when too high
        if (posArray[i3 + 1] > 10) {
          posArray[i3 + 1] = -5
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
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
        size={0.06}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

