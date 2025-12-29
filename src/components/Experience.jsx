import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Environment, 
  PerspectiveCamera,
  useTexture,
  Float
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'

// Scene components
import HallEnvironment from './scene/HallEnvironment'
import EntranceRoom from './rooms/EntranceRoom'
import LobbyRoom from './rooms/LobbyRoom'
import OriginStoriesRoom from './rooms/OriginStoriesRoom'
import LibraryRoom from './rooms/LibraryRoom'
import InspirationGardenRoom from './rooms/InspirationGardenRoom'
import QuizRoom from './rooms/QuizRoom'
import ProductShowcaseRoom from './rooms/ProductShowcaseRoom'
import ThankYouRoom from './rooms/ThankYouRoom'
import ParticleField from './effects/ParticleField'

import { useAppStore, ROOMS, ROOM_ORDER } from '../store/useAppStore'

export default function Experience({ isLoaded, showIntro, onEnter }) {
  const cameraRef = useRef()
  const groupRef = useRef()
  const { camera, gl, size } = useThree()
  
  const currentRoom = useAppStore((state) => state.currentRoom)
  const isTransitioning = useAppStore((state) => state.isTransitioning)
  
  // Mouse tracking for parallax camera effect
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const targetOffset = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })
  
  // Base camera position storage
  const baseCameraPosition = useRef(new THREE.Vector3(0, 0, 15))
  
  // Mouse movement settings - inspired by Wakanda Forever reference
  const MOUSE_SETTINGS = {
    rotationIntensity: 0.08,      // How much the camera rotates (radians)
    positionIntensity: 0.5,       // How much the camera moves laterally
    smoothing: 0.05,              // Lerp factor for smooth movement (lower = smoother)
    deadzone: 0.02                // Ignore tiny movements
  }
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      
      mousePosition.current = { x, y }
      
      // Calculate target rotation and position offset
      targetRotation.current = {
        x: y * MOUSE_SETTINGS.rotationIntensity,  // Look up/down based on mouse Y
        y: -x * MOUSE_SETTINGS.rotationIntensity  // Look left/right based on mouse X
      }
      
      targetOffset.current = {
        x: x * MOUSE_SETTINGS.positionIntensity,
        y: y * MOUSE_SETTINGS.positionIntensity * 0.5
      }
    }
    
    // Handle mouse leaving the window - gently return to center
    const handleMouseLeave = () => {
      targetRotation.current = { x: 0, y: 0 }
      targetOffset.current = { x: 0, y: 0 }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Camera positions for each room
  const cameraPositions = useMemo(() => ({
    [ROOMS.ENTRANCE]: { position: [0, 0, 15], target: [0, 0, 0] },
    [ROOMS.LOBBY]: { position: [0, 2, 12], target: [0, 0, 0] },
    [ROOMS.ORIGIN_STORIES]: { position: [0, 1, 10], target: [0, 0, -5] },
    [ROOMS.LIBRARY]: { position: [0, 1, 10], target: [0, 0, -5] },
    [ROOMS.INSPIRATION_GARDEN]: { position: [0, 2, 12], target: [0, 0, 0] },
    [ROOMS.QUIZ]: { position: [0, 1, 8], target: [0, 0, 0] },
    [ROOMS.PRODUCT_SHOWCASE]: { position: [0, 3, 15], target: [0, 0, 0] },
    [ROOMS.THANK_YOU]: { position: [0, 0, 10], target: [0, 0, 0] }
  }), [])

  // Animate camera on room change
  useEffect(() => {
    if (!cameraRef.current) return
    
    const targetPos = cameraPositions[currentRoom]
    if (!targetPos) return

    // Store the base position for this room
    baseCameraPosition.current.set(
      targetPos.position[0],
      targetPos.position[1],
      targetPos.position[2]
    )

    gsap.to(cameraRef.current.position, {
      x: targetPos.position[0],
      y: targetPos.position[1],
      z: targetPos.position[2],
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }, [currentRoom, cameraPositions])

  // Mouse-following camera movement (Wakanda Forever style parallax)
  useFrame((state, delta) => {
    if (!cameraRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Smoothly interpolate current rotation towards target (lerping)
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * MOUSE_SETTINGS.smoothing
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * MOUSE_SETTINGS.smoothing
    
    // Smoothly interpolate position offset
    currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * MOUSE_SETTINGS.smoothing
    currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * MOUSE_SETTINGS.smoothing
    
    // Apply subtle rotation based on mouse position
    cameraRef.current.rotation.x = currentRotation.current.x
    cameraRef.current.rotation.y = currentRotation.current.y
    
    // Apply subtle position offset for parallax depth effect
    if (!isTransitioning) {
      // Combine base position with mouse offset and subtle floating motion
      const floatY = Math.sin(time * 0.5) * 0.1
      const floatX = Math.cos(time * 0.3) * 0.05
      
      cameraRef.current.position.x = baseCameraPosition.current.x + currentOffset.current.x + floatX
      cameraRef.current.position.y = baseCameraPosition.current.y + currentOffset.current.y * 0.5 + floatY
    }
    
    // Add subtle counter-movement to the scene group for enhanced depth
    if (groupRef.current) {
      // Scene moves slightly opposite to camera for layered parallax
      groupRef.current.rotation.y = -currentRotation.current.y * 0.3
      groupRef.current.rotation.x = -currentRotation.current.x * 0.2
    }
  })

  // Get current room index
  const currentRoomIndex = ROOM_ORDER.indexOf(currentRoom)

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[0, 0, 15]}
        fov={45}
        near={0.1}
        far={1000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Accent lights */}
      <pointLight 
        position={[0, 5, 0]} 
        intensity={1}
        color="#00ff88"
        distance={20}
        decay={2}
      />
      <pointLight 
        position={[-5, 2, 5]} 
        intensity={0.5}
        color="#00cc66"
        distance={15}
      />
      <pointLight 
        position={[5, 2, 5]} 
        intensity={0.5}
        color="#00cc66"
        distance={15}
      />

      {/* Environment */}
      <fog attach="fog" args={['#0a0d0a', 10, 50]} />
      
      {/* Main Scene Group - with subtle counter-parallax for depth */}
      <group ref={groupRef} rotation={[0, 0, 0]}>
        {/* Hall Environment - Always present */}
        <HallEnvironment />
        
        {/* Particle Effects */}
        <ParticleField count={200} />

        {/* Rooms - Conditionally rendered to prevent raycast conflicts */}
        <group position={[0, 0, 0]}>
          {/* Entrance */}
          {currentRoom === ROOMS.ENTRANCE && (
            <EntranceRoom onEnter={onEnter} isActive={true} />
          )}

          {/* Lobby */}
          {currentRoom === ROOMS.LOBBY && (
            <LobbyRoom isActive={true} />
          )}

          {/* Origin Stories */}
          {currentRoom === ROOMS.ORIGIN_STORIES && (
            <OriginStoriesRoom isActive={true} />
          )}

          {/* Library */}
          {currentRoom === ROOMS.LIBRARY && (
            <LibraryRoom isActive={true} />
          )}

          {/* Inspiration Garden */}
          {currentRoom === ROOMS.INSPIRATION_GARDEN && (
            <InspirationGardenRoom isActive={true} />
          )}

          {/* Quiz */}
          {currentRoom === ROOMS.QUIZ && (
            <QuizRoom isActive={true} />
          )}

          {/* Product Showcase */}
          {currentRoom === ROOMS.PRODUCT_SHOWCASE && (
            <ProductShowcaseRoom isActive={true} />
          )}

          {/* Thank You */}
          {currentRoom === ROOMS.THANK_YOU && (
            <ThankYouRoom isActive={true} />
          )}
        </group>
      </group>

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom 
          intensity={0.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette 
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration 
          offset={[0.0005, 0.0005]}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

