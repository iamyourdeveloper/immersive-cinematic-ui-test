import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useAppStore, ROOMS } from '../../store/useAppStore'

// Video URL for the TVC (external Wakanda Forever video)
const TVC_VIDEO_URL = 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/tvc.webm'

export default function ProductShowcaseRoom({ isActive }) {
  const groupRef = useRef()
  const bottlesRef = useRef()
  const [isBottlesHovered, setIsBottlesHovered] = useState(false)
  const [leftButtonHovered, setLeftButtonHovered] = useState(false)
  const [rightButtonHovered, setRightButtonHovered] = useState(false)
  const openVideoModal = useAppStore((state) => state.openVideoModal)
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)

  useEffect(() => {
    if (isActive && groupRef.current) {
      gsap.fromTo(groupRef.current.position,
        { z: -10 },
        { z: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  }, [isActive])

  // Reset hover state when room becomes inactive
  useEffect(() => {
    if (!isActive) {
      setIsBottlesHovered(false)
      document.body.style.cursor = 'auto'
    }
  }, [isActive])

  // Animate bottles glow on hover
  useFrame((state) => {
    if (bottlesRef.current) {
      const time = state.clock.getElapsedTime()
      // Gentle floating animation
      bottlesRef.current.position.y = Math.sin(time * 0.5) * 0.1
      
      // Pulse glow when hovered
      if (isBottlesHovered) {
        const pulseIntensity = 0.3 + Math.sin(time * 3) * 0.1
        bottlesRef.current.children.forEach(child => {
          if (child.material && child.material.opacity !== undefined) {
            child.material.opacity = pulseIntensity
          }
        })
      }
    }
  })

  const handleBottlesClick = () => {
    if (!isActive) return
    openVideoModal({
      name: 'Sprite Zero Sugar®',
      title: 'Commercial',
      videoUrl: TVC_VIDEO_URL,
      wakandaText: 'OPEN YOUR INFINITE POTENTIAL'
    })
  }

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Sprite bottles display in center - Interactive */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
        <group 
          ref={bottlesRef}
          position={[0, 0, 0]}
          onClick={handleBottlesClick}
          onPointerOver={() => {
            if (!isActive) return
            setIsBottlesHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            if (!isActive) return
            setIsBottlesHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <SpriteBottle position={[-0.8, 0, 0]} scale={2} isHovered={isBottlesHovered} />
          <SpriteBottle position={[0.8, 0.4, -0.3]} scale={3.2} isHovered={isBottlesHovered} />
          
          {/* Glow ring at base when hovered */}
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={isBottlesHovered ? 0.4 : 0.15}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Floating particles around bottles when hovered */}
          {isBottlesHovered && (
            <BottleParticles />
          )}
        </group>
      </Float>

      {/* Watch Button - Only visible when Product Showcase Room is active */}
      {isActive && (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
          <group position={[3.5, 1.5, -1]}>
            <Html 
              center 
              distanceFactor={6}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: isActive ? 'auto' : 'none' }}
            >
              <button 
                className="quiz-3d-button"
                onClick={handleBottlesClick}
                onMouseEnter={() => setIsBottlesHovered(true)}
                onMouseLeave={() => setIsBottlesHovered(false)}
                style={{
                  background: 'transparent',
                  border: '3px solid rgba(0, 255, 136, 0.7)',
                  color: '#fff',
                  padding: '28px 56px',
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
                  boxShadow: '0 0 25px rgba(0, 255, 136, 0.3)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" fill="#00ff88" />
                </svg>
                <span>WATCH</span>
              </button>
            </Html>
          </group>
        </Float>
      )}

      {/* Platform/pedestal */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2, 2.5, 1, 16]} />
        <meshStandardMaterial 
          color="#0a1a0a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Platform glow ring */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Side portrait displays */}
      {/* Left navigation portal - Find Your Gift */}
      <group position={[-10, 0, -2]}>
        <SidePortrait position={[0, 0, 0]} label="FIND YOUR GIFT" isClickable onClick={() => setCurrentRoom(ROOMS.QUIZ)} />
        {/* Navigation Button */}
        {isActive && (
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
            <group position={[0, 2.5, 0.5]}>
              <Html 
                center 
                distanceFactor={6}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                <button 
                  onClick={() => setCurrentRoom(ROOMS.QUIZ)}
                  onMouseEnter={() => setLeftButtonHovered(true)}
                  onMouseLeave={() => setLeftButtonHovered(false)}
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
                    boxShadow: leftButtonHovered ? '0 0 40px rgba(0, 255, 136, 0.5)' : '0 0 25px rgba(0, 255, 136, 0.25)',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>FIND YOUR GIFT</span>
                </button>
              </Html>
            </group>
          </Float>
        )}
      </group>

      {/* Right navigation portal - The Library */}
      <group position={[10, 0, -2]}>
        <SidePortrait position={[0, 0, 0]} label="THE LIBRARY" isClickable onClick={() => setCurrentRoom(ROOMS.LIBRARY)} />
        {/* Navigation Button */}
        {isActive && (
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
            <group position={[0, 2.5, 0.5]}>
              <Html 
                center 
                distanceFactor={6}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                <button 
                  onClick={() => setCurrentRoom(ROOMS.LIBRARY)}
                  onMouseEnter={() => setRightButtonHovered(true)}
                  onMouseLeave={() => setRightButtonHovered(false)}
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
                    boxShadow: rightButtonHovered ? '0 0 40px rgba(0, 255, 136, 0.5)' : '0 0 25px rgba(0, 255, 136, 0.25)',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>THE LIBRARY</span>
                </button>
              </Html>
            </group>
          </Float>
        )}
      </group>

      <SidePortrait position={[-10, 0, 5]} label="ALICIA DIAZ" />
      <SidePortrait position={[10, 0, 5]} label="JASMINE ALEXIA" />

      {/* Dome ceiling */}
      <mesh position={[0, 10, -5]}>
        <sphereGeometry args={[12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#1a1f1a"
          side={THREE.BackSide}
          metalness={0.2}
        />
      </mesh>

      {/* Dome framework */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i}
          position={[0, 10, -5]}
          rotation={[0, (i / 8) * Math.PI * 2, Math.PI / 4]}
        >
          <torusGeometry args={[10, 0.05, 4, 32, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#c4a35a"
            metalness={0.6}
          />
        </mesh>
      ))}

      {/* Floor circles */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>

      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 6.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// Video Screen Component that plays video directly on the 3D screen
function VideoScreen({ isActive }) {
  const meshRef = useRef()
  const frameRef = useRef()
  const [videoTexture, setVideoTexture] = useState(null)
  const videoRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const openVideoModal = useAppStore((state) => state.openVideoModal)

  // Create video texture and play video directly on the screen
  useEffect(() => {
    if (!isActive) {
      // When transitioning away, pause the video
      if (videoRef.current) {
        try {
          videoRef.current.pause()
        } catch {
          // ignore
        }
      }
      setIsHovered(false)
      return
    }

    let cancelled = false
    let createdTexture = null

    // Create video element if it doesn't exist
    if (!videoRef.current) {
      const video = document.createElement('video')
      videoRef.current = video
      video.src = TVC_VIDEO_URL
      video.preload = 'auto'
      video.muted = true
      video.playsInline = true
      video.crossOrigin = 'anonymous'
      video.loop = true // Loop the video continuously
    }

    const video = videoRef.current

    const cleanup = () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
    }

    const createTextureIfNeeded = () => {
      if (cancelled || createdTexture) return
      const texture = new THREE.VideoTexture(video)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false
      createdTexture = texture
      setVideoTexture(texture)
    }

    const handleLoadedData = () => {
      // Once video data is loaded, create texture and start playing
      createTextureIfNeeded()
      video.play().catch(() => {
        // Autoplay may be blocked; video will show first frame
      })
    }

    const handleCanPlay = () => {
      // Start playing when video can play
      if (!cancelled) {
        video.play().catch(() => {
          // ignore autoplay restrictions
        })
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)

    // If video is already loaded, create texture and play immediately
    if (video.readyState >= 2) {
      createTextureIfNeeded()
      video.play().catch(() => {
        // ignore
      })
    }

    return () => {
      cancelled = true
      cleanup()
      if (createdTexture) {
        createdTexture.dispose()
        createdTexture = null
      }
    }
  }, [isActive])

  // Keep video playing when room becomes active again
  useEffect(() => {
    if (isActive && videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {
        // ignore autoplay restrictions
      })
    }
  }, [isActive])

  // Handle click to open video modal - only when room is active
  const handleClick = () => {
    if (!isActive) return
    openVideoModal({
      name: 'Sprite Zero Sugar®',
      title: 'Commercial',
      videoUrl: TVC_VIDEO_URL,
      wakandaText: 'OPEN YOUR INFINITE POTENTIAL'
    })
  }

  // Handler for pointer events - prevent interaction when room is not active
  const handlePointerEnter = () => {
    if (!isActive) return
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    if (!isActive) return
    setIsHovered(false)
    document.body.style.cursor = 'auto'
  }

  // Animate frame glow on hover
  useFrame((state) => {
    if (frameRef.current) {
      const time = state.clock.getElapsedTime()
      const baseOpacity = isHovered ? 0.6 : 0.3
      frameRef.current.material.opacity = baseOpacity + Math.sin(time * 2) * 0.1
    }
  })

  return (
    // Positioned to sit behind the bottles, centered in view for the Product Showcase camera.
    <group position={[0, 1.6, -2.2]}>
      {/* Screen frame - outer border */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[5.4, 3.2]} />
        <meshBasicMaterial 
          color="#0a1a0a"
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Glowing border */}
      <mesh ref={frameRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[5.2, 3]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Corner accents */}
      {/* Top Left */}
      <mesh position={[-2.5, 1.4, 0.01]}>
        <planeGeometry args={[0.4, 0.02]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-2.5, 1.4, 0.01]}>
        <planeGeometry args={[0.02, 0.4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      {/* Top Right */}
      <mesh position={[2.5, 1.4, 0.01]}>
        <planeGeometry args={[0.4, 0.02]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      <mesh position={[2.5, 1.4, 0.01]}>
        <planeGeometry args={[0.02, 0.4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      {/* Bottom Left */}
      <mesh position={[-2.5, -1.4, 0.01]}>
        <planeGeometry args={[0.4, 0.02]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-2.5, -1.4, 0.01]}>
        <planeGeometry args={[0.02, 0.4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      {/* Bottom Right */}
      <mesh position={[2.5, -1.4, 0.01]}>
        <planeGeometry args={[0.4, 0.02]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>
      <mesh position={[2.5, -1.4, 0.01]}>
        <planeGeometry args={[0.02, 0.4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
      </mesh>

      {/* Main video display surface */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[5, 2.8]} />
        {videoTexture ? (
          <meshBasicMaterial 
            map={videoTexture}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial 
            color="#1a2a1a"
          />
        )}
      </mesh>

      {/* Green tint overlay - subtle */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[5, 2.8]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vignette overlay */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[5, 2.8]} />
        <meshBasicMaterial 
          color="#000000"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Scan line effect */}
      <ScanLineEffect />

      {/* Watch button overlay - Only render when room is active */}
      {isActive && (
        <group position={[0, 0, 0.05]}>
          <mesh 
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <planeGeometry args={[1.4, 0.5]} />
            <meshBasicMaterial 
              color="#0a1a0a"
              transparent
              opacity={isHovered ? 0.95 : 0.85}
            />
          </mesh>
          {/* Button border */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[1.5, 0.6]} />
            <meshBasicMaterial 
              color="#00ff88"
              transparent
              opacity={isHovered ? 0.8 : 0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[1.4, 0.5]} />
            <meshBasicMaterial 
              color="#0a1a0a"
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Watch icon */}
          <Html
            center
            position={[0, 0, 0.01]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isHovered ? '#00ff88' : '#ffffff',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              WATCH
            </div>
          </Html>
        </group>
      )}

      {/* Hotspot indicator below */}
      <mesh position={[0, -1.7, 0.01]}>
        <circleGeometry args={[0.1, 6]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 1 : 0.6}
        />
      </mesh>
      <mesh position={[0, -1.55, 0.01]}>
        <planeGeometry args={[0.01, 0.2]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// Scan line effect for video screen
function ScanLineEffect() {
  const scanLineRef = useRef()

  useFrame((state) => {
    if (scanLineRef.current) {
      const time = state.clock.getElapsedTime()
      // Move scan line up and down
      const y = Math.sin(time * 0.5) * 1.3
      scanLineRef.current.position.y = y
    }
  })

  return (
    <mesh ref={scanLineRef} position={[0, 0, 0.003]}>
      <planeGeometry args={[5, 0.02]} />
      <meshBasicMaterial 
        color="#00ff88"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Bottle Particles Component - appears when bottles are hovered
function BottleParticles() {
  const particlesRef = useRef()
  const count = 25

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
      const radius = 1.8 + Math.random() * 0.8
      const height = Math.random() * 4 - 1
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
        size={0.06}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function SpriteBottle({ position, scale = 1, isHovered = false }) {
  const bottleRef = useRef()

  useFrame((state) => {
    if (bottleRef.current) {
      const time = state.clock.getElapsedTime()
      bottleRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <group ref={bottleRef} position={position} scale={scale}>
      {/* Bottle body - inner glow */}
      <mesh position={[0, 0, 0]} renderOrder={9}>
        <cylinderGeometry args={[0.22, 0.27, 1.15, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ffcc" : "#00ffaa"}
          transparent
          opacity={isHovered ? 0.7 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bottle neck */}
      <mesh position={[0, 0.68, 0]} renderOrder={10}>
        <cylinderGeometry args={[0.08, 0.18, 0.35, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ffcc" : "#00ffaa"}
          transparent
          opacity={isHovered ? 0.7 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cap - solid bright green */}
      <mesh position={[0, 0.9, 0]} renderOrder={11}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ffaa" : "#00ff88"}
          transparent
          opacity={isHovered ? 0.9 : 0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label - bright accent */}
      <mesh position={[0, -0.1, 0.24]} renderOrder={12}>
        <planeGeometry args={[0.35, 0.45]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ffee" : "#00ffcc"}
          transparent
          opacity={isHovered ? 1 : 0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Liquid glow inside */}
      <mesh position={[0, -0.2, 0]} renderOrder={8}>
        <cylinderGeometry args={[0.18, 0.23, 0.8, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ffaa" : "#00ff88"}
          transparent
          opacity={isHovered ? 0.6 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function SidePortrait({ position, label, isClickable = false, onClick }) {
  const portraitRef = useRef()
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (portraitRef.current) {
      const time = state.clock.getElapsedTime()
      const baseOpacity = isHovered ? 0.5 : 0.2
      portraitRef.current.material.opacity = baseOpacity + Math.sin(time * 1.5) * 0.15
    }
  })

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick()
    }
  }

  const handlePointerEnter = () => {
    if (isClickable) {
      setIsHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerLeave = () => {
    if (isClickable) {
      setIsHovered(false)
      document.body.style.cursor = 'auto'
    }
  }

  return (
    <group 
      position={position}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Portrait frame */}
      <mesh>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial 
          color={isHovered ? "#1a2a1a" : "#0a1a0a"}
          metalness={0.3}
          emissive={isHovered ? "#00ff88" : "#000000"}
          emissiveIntensity={isHovered ? 0.1 : 0}
        />
      </mesh>

      {/* Portrait glow */}
      <mesh ref={portraitRef} position={[0, 0, 0.08]}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Frame border */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.1, 3.1]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={isHovered ? 0.3 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hover glow effect for clickable portraits */}
      {isClickable && isHovered && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.3, 3.3]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

