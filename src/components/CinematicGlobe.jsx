import { useEffect, useRef, useState, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars, Html, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// IIIT Sri City Coordinates
const IIIT_LAT = 13.5559
const IIIT_LON = 80.0268

// Convert lat/lon to 3D sphere coordinates
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

// Easing function for smooth camera movement
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// Earth Globe Component
function Earth({ scrollProgress }) {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const groupRef = useRef()
  const { camera } = useThree()
  
  const [dayMap, bumpMap, specularMap, cloudsMap] = useTexture([
    '/textures/earth-day.jpg',
    '/textures/earth-bump.jpg',
    '/textures/earth-specular.jpg',
    '/textures/earth-clouds.png',
  ])

  // Calculate the Y rotation needed to show India (IIIT Sri City) facing the camera
  //
  // Camera is at (0, 0, +Z) looking at origin, so it sees the +Z hemisphere
  // 
  // For a standard SphereGeometry with equirectangular texture:
  // - The sphere's local +X axis shows lon=0° (Greenwich)
  // - The sphere's local +Z axis shows lon=-90° (90° West, Pacific Ocean)
  // - The sphere's local -Z axis shows lon=+90° (90° East, close to India!)
  //
  // IIIT is at lon=80°E, which is close to the -Z axis
  // To show lon=80°E on the +Z axis (facing camera), we need to rotate by 180° - (90-80) = 170°
  // Or: rotate by -(180 - 10) = -170° around Y
  //
  // Actually simpler: 
  // - At rotation.y = 0, camera sees lon=-90° (Pacific)
  // - At rotation.y = π (180°), camera sees lon=+90°
  // - To see lon=80°, we need: rotation.y = (80 + 90) * π/180 = 170° in radians
  // - But which direction? Test shows we need NEGATIVE rotation for EAST longitudes
  //
  // The formula that works: rotation.y = -(longitude + 90) * π/180
  // For lon=80°E: rotation.y = -(80+90) * π/180 = -2.967 rad ≈ -170°
  const indiaRotationY = useMemo(() => {
    const lonDeg = IIIT_LON // 80°E
    // To show longitude L facing the +Z camera:
    // rotation.y = -((L + 90) * π/180)
    return -((lonDeg + 90) * Math.PI / 180)
  }, [])

  // Track the rotation at the end of Phase 1
  const phase1EndRotRef = useRef(0)
  const phase2Started = useRef(false)

  useFrame((state, delta) => {
    // Clouds rotation
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015
    }

    if (!groupRef.current) return

    // Phase 1: Slow rotation showing the globe (0-10% scroll)
    if (scrollProgress < 0.10) {
      // Gentle rotation - based on time
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.rotation.x = 0
      camera.position.set(0, 0, 3.5)
      camera.lookAt(0, 0, 0)
      
      // Reset phase 2 tracking
      phase2Started.current = false
    }
    // Phase 2: Rotate to show India (10-30% scroll)
    else if (scrollProgress < 0.30) {
      // Capture starting rotation on first entry to Phase 2
      if (!phase2Started.current) {
        phase1EndRotRef.current = groupRef.current.rotation.y
        phase2Started.current = true
      }
      
      const rotateProgress = (scrollProgress - 0.10) / 0.20
      const eased = easeOutCubic(rotateProgress)
      
      // Smoothly interpolate from Phase 1 end rotation to India
      groupRef.current.rotation.y = THREE.MathUtils.lerp(phase1EndRotRef.current, indiaRotationY, eased)
      groupRef.current.rotation.x = 0
      
      // Camera stays at same distance but slightly moves closer
      const dist = THREE.MathUtils.lerp(3.5, 3.0, eased)
      camera.position.set(0, 0, dist)
      camera.lookAt(0, 0, 0)
    }
    // Phase 3: Zoom into India - camera stays on Z axis, globe is rotated correctly (30-100%)
    else {
      // Lock rotation to show India
      groupRef.current.rotation.y = indiaRotationY
      
      // Calculate zoom progress (0 to 1 from 30% to 100%)
      const zoomProgress = (scrollProgress - 0.30) / 0.70
      const easedZoom = easeOutCubic(zoomProgress)
      
      // Also tilt the globe slightly to better center on India's latitude (13.5°N)
      // This is a rotation around X axis to bring South India into better view
      const latTilt = IIIT_LAT * (Math.PI / 180) * 0.5 // Gentle tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(0, -latTilt, easedZoom)
      
      // Camera zooms in along Z axis (India is facing camera)
      // From distance 3.0 to very close 1.05
      const startDist = 3.0
      const endDist = 1.08
      const currentDist = THREE.MathUtils.lerp(startDist, endDist, easedZoom)
      
      // Slight vertical offset to center on South India as we zoom
      const yOffset = easedZoom * -0.15 // Move camera slightly down to center on South India
      
      camera.position.set(0, yOffset, currentDist)
      camera.lookAt(0, yOffset * 0.5, 0)
    }
  })

  // Show marker when zoomed in enough (after India is centered)
  const showMarker = scrollProgress > 0.45 && scrollProgress < 0.88

  return (
    <group ref={groupRef}>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.03}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap} 
          transparent 
          opacity={0.35} 
          depthWrite={false}
        />
      </mesh>

      {/* IIIT Sri City Marker */}
      {showMarker && (
        <IIITMarker scrollProgress={scrollProgress} />
      )}
    </group>
  )
}

// IIIT Marker Component
function IIITMarker({ scrollProgress }) {
  const meshRef = useRef()
  const position = useMemo(() => latLonToVector3(IIIT_LAT, IIIT_LON, 1.02), [])
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3
      meshRef.current.scale.setScalar(scale)
    }
  })

  const markerOpacity = Math.min((scrollProgress - 0.45) / 0.1, 1)

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#ff2546" transparent opacity={markerOpacity} />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.03, 32]} />
        <meshBasicMaterial color="#ff2546" transparent opacity={markerOpacity * 0.6} side={THREE.DoubleSide} />
      </mesh>

      {scrollProgress > 0.55 && scrollProgress < 0.85 && (
        <Html position={[0, 0.05, 0]} center style={{ pointerEvents: 'none' }}>
          <div 
            className="bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-white whitespace-nowrap border border-red-500"
            style={{ opacity: Math.min((scrollProgress - 0.55) / 0.1, 1) }}
          >
            <span className="text-red-400 mr-1">📍</span>
            IIIT Sri City
          </div>
        </Html>
      )}
    </group>
  )
}

// Space particles
function SpaceParticles({ count = 100 }) {
  const mesh = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 3
      temp.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ])
    }
    return new Float32Array(temp.flat())
  }, [count])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0001
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.008} color="#ff6b6b" transparent opacity={0.4} />
    </points>
  )
}

// Loading component
function GlobeLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <p className="text-red-300 text-sm">Loading Earth...</p>
      </div>
    </Html>
  )
}

// Satellite Map Overlay - Only shows at very end
function SatelliteOverlay({ scrollProgress }) {
  const [tiles, setTiles] = useState([])
  
  // Only show at 85%+ scroll
  const opacity = useMemo(() => {
    if (scrollProgress < 0.85) return 0
    return Math.min((scrollProgress - 0.85) / 0.1, 1)
  }, [scrollProgress])

  const mapZoom = useMemo(() => {
    if (scrollProgress < 0.88) return 15
    if (scrollProgress < 0.94) return 17
    return 18
  }, [scrollProgress])

  useEffect(() => {
    if (opacity === 0) {
      setTiles([])
      return
    }
    
    const scale = Math.pow(2, mapZoom)
    const latRad = IIIT_LAT * Math.PI / 180
    const centerTileX = Math.floor((IIIT_LON + 180) / 360 * scale)
    const centerTileY = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale)

    const gridSize = 5
    const offset = Math.floor(gridSize / 2)
    const newTiles = []
    
    for (let dy = -offset; dy <= offset; dy++) {
      for (let dx = -offset; dx <= offset; dx++) {
        const x = centerTileX + dx
        const y = centerTileY + dy
        if (y >= 0 && y < scale) {
          newTiles.push({
            x: ((x % scale) + scale) % scale,
            y,
            dx,
            dy,
            key: `${mapZoom}-${x}-${y}`
          })
        }
      }
    }
    
    setTiles(newTiles)
  }, [mapZoom, opacity])

  if (opacity === 0) return null

  const tileSize = 256
  const gridSize = 5
  const offset = Math.floor(gridSize / 2)

  return (
    <div 
      className="absolute inset-0 z-10 overflow-hidden"
      style={{ 
        opacity,
        backgroundColor: '#0a0a0a'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative"
          style={{ 
            width: tileSize * gridSize, 
            height: tileSize * gridSize,
            transform: `scale(${1.2 + (scrollProgress - 0.85) * 2})`
          }}
        >
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={`https://mt1.google.com/vt/lyrs=s&x=${tile.x}&y=${tile.y}&z=${mapZoom}`}
              alt=""
              className="absolute"
              style={{
                width: tileSize,
                height: tileSize,
                left: (tile.dx + offset) * tileSize,
                top: (tile.dy + offset) * tileSize,
              }}
              loading="eager"
            />
          ))}
          
          {/* Labels overlay */}
          {tiles.map((tile) => (
            <img
              key={`lbl-${tile.key}`}
              src={`https://mt1.google.com/vt/lyrs=h&x=${tile.x}&y=${tile.y}&z=${mapZoom}`}
              alt=""
              className="absolute"
              style={{
                width: tileSize,
                height: tileSize,
                left: (tile.dx + offset) * tileSize,
                top: (tile.dy + offset) * tileSize,
                opacity: 0.8
              }}
              loading="eager"
            />
          ))}
        </div>
      </div>

      {/* Campus marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="absolute inset-0 -m-6 bg-red-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 -m-4 bg-red-500/30 rounded-full animate-pulse" />
          <div className="relative w-14 h-14 bg-linear-to-br from-red-600 to-red-900 rounded-full border-3 border-white shadow-[0_0_40px_#ff2546] flex items-center justify-center">
            <span className="text-xl">🏛️</span>
          </div>
        </div>
      </div>

      {/* Location label */}
      {scrollProgress > 0.9 && (
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: Math.min((scrollProgress - 0.9) / 0.08, 1) }}
        >
          <div className="bg-black/90 backdrop-blur-lg px-6 py-4 rounded-xl border border-red-500/40 shadow-2xl">
            <div className="flex items-center gap-4 text-white">
              <div className="text-3xl">📍</div>
              <div>
                <div className="font-bold text-lg text-red-300">IIIT Sri City Campus</div>
                <div className="text-sm text-white/60">Sri City, Andhra Pradesh</div>
                <div className="text-xs text-white/40 font-mono mt-1">13.5559°N, 80.0268°E</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
      />
    </div>
  )
}

// Main Component
export default function CinematicGlobe() {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=400%",
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    })

    return () => trigger.kill()
  }, [])

  // Globe opacity - only fade at very end when satellite appears
  const globeOpacity = scrollProgress > 0.82 
    ? Math.max(0, 1 - (scrollProgress - 0.82) / 0.12)
    : 1

  return (
    <section ref={containerRef} className="relative min-h-screen bg-black">
      {/* 3D Globe Scene */}
      <div 
        className="absolute inset-0"
        style={{ opacity: globeOpacity }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<GlobeLoader />}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <directionalLight position={[-3, -2, -3]} intensity={0.3} />
            
            {/* Globe */}
            <Earth scrollProgress={scrollProgress} />
            
            {/* Background elements */}
            <SpaceParticles count={150} />
            <Stars 
              radius={100} 
              depth={50} 
              count={2000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={0.5} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Satellite overlay - appears at very end */}
      <SatelliteOverlay scrollProgress={scrollProgress} />

     
    </section>
  )
}
