"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(2.5, 2)
    const material = new THREE.MeshPhongMaterial({
      color: 0x9f1239,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.7,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const orb = new THREE.Mesh(geometry, material)
    scene.add(orb)

    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 1)
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0xd97706,
      emissive: 0x92400e,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const innerOrb = new THREE.Mesh(innerGeometry, innerMaterial)
    scene.add(innerOrb)

    const light1 = new THREE.PointLight(0x9f1239, 3, 100)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xd97706, 2, 100)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
    scene.add(ambientLight)

    camera.position.z = 7

    const animate = () => {
      requestAnimationFrame(animate)

      orb.rotation.x += 0.003
      orb.rotation.y += 0.005

      innerOrb.rotation.x -= 0.004
      innerOrb.rotation.y -= 0.006

      const time = Date.now() * 0.001
      orb.position.y = Math.sin(time) * 0.5
      orb.position.x = Math.cos(time * 0.5) * 0.3

      innerOrb.position.y = Math.cos(time * 1.2) * 0.3
      innerOrb.position.x = Math.sin(time * 0.8) * 0.2

      light1.position.x = Math.sin(time) * 5
      light1.position.y = Math.cos(time) * 5

      light2.position.x = Math.cos(time * 0.8) * 5
      light2.position.y = Math.sin(time * 0.8) * 5

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}
