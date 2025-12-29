import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { CREATORS, useAppStore } from '../../store/useAppStore'

// Centralized hover state manager for statues
const statueHoverState = {
  activeIndex: null,
  timeout: null,
  
  enter(index, setHoveredStatue) {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.activeIndex = index
    setHoveredStatue(index)
    document.body.style.cursor = 'pointer'
  },
  
  leave(index) {
    if (this.activeIndex !== index) return
    
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    
    this.timeout = setTimeout(() => {
      const store = useAppStore.getState()
      if (this.activeIndex === index && !store.isStatueCardHovered) {
        this.activeIndex = null
        store.clearHoveredStatue()
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

export default function InspirationGardenRoom({ isActive }) {
  const groupRef = useRef()

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.position,
        { y: -3 },
        { y: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Clean up hover state when room becomes inactive
  useEffect(() => {
    if (!isActive) {
      statueHoverState.reset()
    }
    return () => statueHoverState.reset()
  }, [isActive])

  // Character data for statues
  const characters = CREATORS.inspirationGarden

  // Bust positions - Dora Milaje (left), Shuri (center), M'Baku (right)
  const bustPositions = useMemo(() => [
    { position: [-4, -1, -5] },  // Left - Dora Milaje
    { position: [0, -1, -6] },   // Center - Shuri
    { position: [4, -1, -5] },   // Right - M'Baku
  ], [])

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Gazebo/Garden structure */}
      <GazeboStructure />

      {/* Statue busts - Interactive */}
      {characters.map((character, i) => (
        <StatueBust 
          key={character.id}
          position={bustPositions[i].position}
          character={character}
          index={i}
          isActive={isActive}
        />
      ))}

      {/* Garden foliage */}
      <GardenFoliage />

      {/* Sky backdrop */}
      <mesh position={[0, 5, -15]}>
        <planeGeometry args={[50, 20]} />
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Mountain silhouette */}
      <MountainBackdrop />

      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial 
          color="#1a2a1a"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  )
}

function GazeboStructure() {
  return (
    <group position={[0, 0, -5]}>
      {/* Central columns */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 8
        return (
          <group 
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius - 3
            ]}
          >
            {/* Column */}
            <mesh>
              <cylinderGeometry args={[0.3, 0.4, 10, 8]} />
              <meshStandardMaterial 
                color="#8b5a2b"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>

            {/* Column capital */}
            <mesh position={[0, 5, 0]}>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial 
                color="#c4a35a"
                metalness={0.6}
              />
            </mesh>
          </group>
        )
      })}

      {/* Roof beams connecting columns */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const nextAngle = ((i + 1) / 6) * Math.PI * 2
        const radius = 8

        return (
          <mesh 
            key={i}
            position={[
              (Math.cos(angle) + Math.cos(nextAngle)) * radius / 2,
              5.3,
              (Math.sin(angle) + Math.sin(nextAngle)) * radius / 2 - 3
            ]}
            rotation={[0, -angle - Math.PI / 6, 0]}
          >
            <boxGeometry args={[radius * 0.6, 0.2, 0.15]} />
            <meshStandardMaterial 
              color="#8b5a2b"
              metalness={0.4}
            />
          </mesh>
        )
      })}

      {/* Central dome frame */}
      <mesh position={[0, 7, -3]}>
        <sphereGeometry args={[4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#c4a35a"
          metalness={0.4}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function StatueBust({ position, character, index, isActive }) {
  const bustRef = useRef()
  const glowRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  
  const setHoveredStatue = useAppStore((state) => state.setHoveredStatue)
  const hoveredStatue = useAppStore((state) => state.hoveredStatue)

  // Sync local hover state with global state
  useEffect(() => {
    setIsHovered(hoveredStatue === index)
  }, [hoveredStatue, index])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (glowRef.current) {
      // Enhanced blinking effect - much brighter and more prominent
      const baseOpacity = isHovered ? 0.7 : 0.5
      const pulseAmount = isHovered ? 0.3 : 0.25
      // Faster pulse with sharp peaks for a blinking effect
      const pulse = Math.pow((Math.sin(time * 3 + index * 1.5) + 1) / 2, 0.6)
      glowRef.current.material.opacity = baseOpacity + pulse * pulseAmount
      
      // Also scale the glow slightly during pulse
      const scaleBase = isHovered ? 1.15 : 1.0
      const scalePulse = 1 + pulse * 0.08
      glowRef.current.scale.setScalar(scaleBase * scalePulse)
    }
  })

  const handlePointerEnter = useCallback(() => {
    if (!isActive) return
    statueHoverState.enter(index, setHoveredStatue)
  }, [isActive, index, setHoveredStatue])

  const handlePointerLeave = useCallback(() => {
    statueHoverState.leave(index)
  }, [index])

  // Hit area size - center statue needs larger hit area due to z-offset
  const hitAreaWidth = index === 1 ? 3.5 : 2.5
  const hitAreaHeight = index === 1 ? 5.5 : 4.5
  const hitAreaDepth = index === 1 ? 3 : 1.5

  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={bustRef} position={position}>
        {/* Interactive hit area */}
        <mesh
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          visible={false}
        >
          <boxGeometry args={[hitAreaWidth, hitAreaHeight, hitAreaDepth]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Pedestal */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.2, 2, 1.2]} />
          <meshStandardMaterial 
            color={isHovered ? "#1f2a1f" : "#1a1f1a"}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Pedestal top trim */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.4, 0.15, 1.4]} />
          <meshStandardMaterial 
            color={isHovered ? "#d4b66a" : "#c4a35a"}
            metalness={0.6}
          />
        </mesh>

        {/* Bust sculpture - abstracted human form */}
        <group position={[0, 1.8, 0]}>
          {/* Head */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Shoulders/Torso */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.4]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Decorative collar/clothing detail */}
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial 
              color="#2a2a2a"
              metalness={0.7}
            />
          </mesh>
        </group>

        {/* Glow behind bust - enhanced blinking effect */}
        <mesh ref={glowRef} position={[0, 1.5, -0.3]}>
          <circleGeometry args={[.9, 32]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={isHovered ? 0.5 : 0.5}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Outer glow ring for extra brightness */}
        <mesh position={[0, 1.5, -0.35]}>
          <ringGeometry args={[1.1, 1.4, 32]} />
          <meshBasicMaterial 
            color="#00ff66"
            transparent
            opacity={isHovered ? 0.5 : 0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Read button above - brighter on hover */}
        <group position={[0, 3, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.35, 0.1]} />
            <meshBasicMaterial 
              color={isHovered ? "#0f2a0f" : "#1a2a1a"}
              transparent
              opacity={isHovered ? 0.95 : 0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.1, 0.45]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        </group>

        {/* Connector line */}
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[0.01, 0.5]} />
          <meshBasicMaterial 
            color="#00ff88" 
            transparent 
            opacity={isHovered ? 0.9 : 0.6} 
          />
        </mesh>

        {/* Hotspot hexagon */}
        <mesh position={[0, 2.2, 0]}>
          <circleGeometry args={[0.1, 6]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={isHovered ? 1 : 0.8}
          />
        </mesh>

        {/* Additional hover glow effect */}
        {isHovered && (
          <mesh position={[0, 1, -0.2]}>
            <planeGeometry args={[2.5, 4]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function GardenFoliage() {
  const foliageData = useMemo(() => 
    [...Array(30)].map(() => ({
      position: [
        (Math.random() - 0.5) * 25,
        -2,
        (Math.random() - 0.5) * 15
      ],
      scale: 0.5 + Math.random() * 1,
      rotation: Math.random() * Math.PI * 2
    }))
  , [])

  return (
    <group>
      {foliageData.map((plant, i) => (
        <group 
          key={i}
          position={plant.position}
          scale={plant.scale}
          rotation={[0, plant.rotation, 0]}
        >
          {/* Fern/leaf clusters */}
          {[...Array(4)].map((_, j) => (
            <mesh 
              key={j}
              position={[
                (Math.random() - 0.5) * 0.5,
                0.3 + Math.random() * 0.5,
                (Math.random() - 0.5) * 0.5
              ]}
              rotation={[
                Math.random() * 0.5 - 0.25,
                j * Math.PI / 2,
                Math.random() * 0.3
              ]}
            >
              <coneGeometry args={[0.15, 0.6, 3]} />
              <meshStandardMaterial 
                color={`hsl(${115 + Math.random() * 25}, 50%, ${25 + Math.random() * 15}%)`}
                roughness={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function MountainBackdrop() {
  return (
    <group position={[0, 0, -12]}>
      {/* Mountain shapes */}
      {[[-8, 3], [0, 5], [8, 4], [-4, 2], [5, 2.5]].map(([x, height], i) => (
        <mesh key={i} position={[x, height / 2 - 1, 0]}>
          <coneGeometry args={[4 + Math.random() * 2, height, 4]} />
          <meshStandardMaterial 
            color={`hsl(${140 + i * 5}, 30%, ${15 + i * 3}%)`}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

