'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function DistortedSphere({ scale = 1 }: { scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12
      meshRef.current.rotation.x += delta * 0.05
      meshRef.current.position.y = Math.sin(time.current * 0.5) * 0.08
    }
  })

  return (
    <Sphere ref={meshRef} args={[1.6, 128, 128]} scale={scale}>
      <MeshDistortMaterial
        color="#8729A0"
        emissive="#3d0066"
        emissiveIntensity={0.5}
        distort={0.45}
        speed={1.2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.92}
      />
    </Sphere>
  )
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (meshRef.current) {
      const s = 1.85 + Math.sin(time.current * 0.8) * 0.05
      meshRef.current.scale.setScalar(s)
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.08 + Math.sin(time.current * 1.2) * 0.02
    }
  })

  return (
    <Sphere ref={meshRef} args={[1.6, 32, 32]}>
      <meshBasicMaterial
        color="#c084fc"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </Sphere>
  )
}

function OrbitalRing({ rotX = 0, rotZ = 0 }: { rotX?: number; rotZ?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
    }
  })

  const geometry = useMemo(() => new THREE.TorusGeometry(2.4, 0.008, 16, 200), [])
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#c084fc',
        transparent: true,
        opacity: 0.15,
      }),
    []
  )

  return (
    <mesh ref={ref} geometry={geometry} material={material} rotation={[rotX, 0, rotZ]} />
  )
}

export default function OrdaSphere({ className = '', large = false }: { className?: string; large?: boolean }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={2} color="#c084fc" />
        <pointLight position={[-3, -2, -2]} intensity={1} color="#8729A0" />
        <spotLight position={[0, 5, 0]} intensity={1.5} color="#ffffff" penumbra={1} />

        <DistortedSphere scale={large ? 1.3 : 1} />
        <InnerGlow />
        <OrbitalRing rotX={Math.PI / 2} />
        <OrbitalRing rotX={Math.PI / 4} rotZ={Math.PI / 6} />
      </Canvas>
    </div>
  )
}
