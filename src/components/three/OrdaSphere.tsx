'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function DistortedCore({ large = false }: { large?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.1
    mesh.current.rotation.z += delta * 0.04
    mesh.current.position.y = Math.sin(t.current * 0.5) * 0.06
  })

  return (
    <Sphere ref={mesh} args={[large ? 2.0 : 1.65, 128, 128]}>
      <MeshDistortMaterial
        color="#6b21a8"
        emissive="#3b0764"
        emissiveIntensity={0.55}
        distort={0.5}
        speed={1.1}
        roughness={0.08}
        metalness={0.85}
        transparent
        opacity={0.9}
      />
    </Sphere>
  )
}

function GlowShell({ large = false }: { large?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (!mesh.current) return
    const s = (large ? 2.35 : 1.95) + Math.sin(t.current * 0.8) * 0.06
    mesh.current.scale.setScalar(s)
    ;(mesh.current.material as THREE.MeshBasicMaterial).opacity =
      0.06 + Math.sin(t.current) * 0.02
  })

  return (
    <Sphere ref={mesh} args={[1, 32, 32]}>
      <meshBasicMaterial color="#c084fc" transparent opacity={0.06} side={THREE.BackSide} />
    </Sphere>
  )
}

function Ring({ rx = 0, rz = 0, speed = 0.15 }: { rx?: number; rz?: number; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, d) => { if (mesh.current) mesh.current.rotation.y += d * speed })
  return (
    <mesh ref={mesh} rotation={[rx, 0, rz]}>
      <torusGeometry args={[2.3, 0.007, 16, 200]} />
      <meshBasicMaterial color="#c084fc" transparent opacity={0.14} />
    </mesh>
  )
}

export default function OrdaSphere({ large = false, className = '' }: { large?: boolean; className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 44 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 3, 3]} intensity={2.5} color="#c084fc" />
        <pointLight position={[-3, -2, -2]} intensity={1.2} color="#7c3aed" />
        <spotLight position={[0, 6, 2]} intensity={1.5} color="#ffffff" penumbra={0.8} />
        <DistortedCore large={large} />
        <GlowShell large={large} />
        <Ring rx={Math.PI / 2} speed={0.12} />
        <Ring rx={Math.PI / 4} rz={Math.PI / 5} speed={0.09} />
      </Canvas>
    </div>
  )
}
