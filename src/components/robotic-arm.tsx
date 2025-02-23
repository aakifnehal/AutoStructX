"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

export function RoboticArm() {
  const baseRef = useRef<Mesh>(null)
  const armRef = useRef<Mesh>(null)
  const forearmRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (baseRef.current && armRef.current && forearmRef.current) {
      // Simulate robotic arm movement
      baseRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5
      armRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2
      forearmRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1
    }
  })

  return (
    <group position={[0, -2, 0]}>
      {/* Base */}
      <mesh ref={baseRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Main arm */}
      <mesh ref={armRef} position={[0, 1, 0]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Forearm */}
      <mesh ref={forearmRef} position={[0, 2, 0]}>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  )
}

