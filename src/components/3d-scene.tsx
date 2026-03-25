"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Environment, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function RotatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.35
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.15
      meshRef.current.scale.set(
        1 + (hovered ? 0.25 : 0.05) * Math.sin(clock.getElapsedTime() * 1.5),
        1 + (hovered ? 0.25 : 0.05) * Math.cos(clock.getElapsedTime() * 1.5),
        1 + (hovered ? 0.25 : 0.05) * Math.sin(clock.getElapsedTime() * 1.5)
      )
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      position={[0, 0, 0]}
    >
      <torusGeometry args={[2, 0.8, 32, 128]} />
      <meshStandardMaterial
        color={hovered ? '#00ffff' : '#ff006e'}
        emissive={hovered ? '#00ffff' : '#ff00ff'}
        emissiveIntensity={hovered ? 1 : 0.5}
        metalness={0.9}
        roughness={0.1}
        wireframe={false}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.08
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.05
    }
  })

  const colors = [
    '#ff006e',  // Pink
    '#ffbe0b',  // Yellow
    '#3a86ff',  // Blue
    '#fb5607',  // Orange
    '#8338ec',  // Purple
    '#00ffff',  // Cyan
  ]

  return (
    <group ref={groupRef}>
      {[...Array(40)].map((_, i) => {
        const angle = (i / 40) * Math.PI * 2
        const radius = 4 + Math.sin(i * 0.3) * 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = (Math.sin(i * 0.5) * 2.5) + Math.cos(i * 0.7)

        return (
          <mesh key={i} position={[x, y, z]} scale={0.35}>
            <octahedronGeometry args={[0.5, 1]} />
            <meshStandardMaterial
              color={colors[i % colors.length]}
              emissive={colors[i % colors.length]}
              emissiveIntensity={0.8}
              metalness={0.7}
              roughness={0.3}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function IcosphereBackground() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08
    }
  })

  return (
    <mesh ref={meshRef} scale={[8, 8, 8]} position={[0, 0, -5]}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        color="#0a0e27"
        emissive="#1a1f3a"
        emissiveIntensity={0.3}
        wireframe={false}
        transparent
        opacity={0.1}
      />
    </mesh>
  )
}

export function Scene3D() {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
      <color attach="background" args={['#0a0e27']} />

      {/* Lights */}
      <ambientLight intensity={0.4} color="#00ffff" />
      <ambientLight intensity={0.2} color="#ff00ff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffbe0b" />
      <pointLight position={[-10, -10, 10]} intensity={1} color="#3a86ff" />

      {/* Objects */}
      <IcosphereBackground />
      <RotatingTorus />
      <FloatingParticles />

      {/* Environment */}
      <Environment preset="city" />
    </Canvas>
  )
}
