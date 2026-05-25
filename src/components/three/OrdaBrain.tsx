'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Brain() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.12
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 6]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.3}
        roughness={0.05}
        transmission={0.95}
        ior={1.5}
        chromaticAberration={0.06}
        distortion={0.3}
        distortionScale={0.5}
        temporalDistortion={0.1}
        color="#EFEFEF"
      />
    </mesh>
  )
}

export default function OrdaBrain({ size = 500 }: { size?: number }) {
  return (
    <Canvas
      style={{ width: size, height: size }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={1.5} color="#FFE8B0" />
      <pointLight position={[-6, -4, -4]} intensity={0.6} color="#888888" />
      <pointLight position={[0, -6, 3]} intensity={0.4} color="#D4A853" />
      <Environment preset="city" />
      <Brain />
    </Canvas>
  )
}
