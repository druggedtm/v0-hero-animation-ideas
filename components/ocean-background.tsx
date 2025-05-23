"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function OceanBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create ocean geometry
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 50, 50)

    // Ocean material with animated waves
    const oceanMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x006994) },
        color2: { value: new THREE.Color(0x004d6b) },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float wave1 = sin(pos.x * 0.1 + time * 2.0) * 2.0;
          float wave2 = sin(pos.y * 0.1 + time * 1.5) * 1.5;
          float wave3 = sin((pos.x + pos.y) * 0.05 + time * 3.0) * 1.0;
          
          pos.z = wave1 + wave2 + wave3;
          vWave = pos.z;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          float mixFactor = (vWave + 3.0) / 6.0;
          vec3 color = mix(color1, color2, mixFactor);
          
          // Add some foam effect
          float foam = smoothstep(2.0, 3.0, vWave);
          color = mix(color, vec3(0.8, 0.9, 1.0), foam * 0.3);
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true,
    })

    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
    ocean.rotation.x = -Math.PI / 2
    ocean.position.y = -10
    scene.add(ocean)

    // Add some floating containers
    const containerGeometry = new THREE.BoxGeometry(4, 2, 8)
    const containers: THREE.Mesh[] = []

    const containerColors = [0xf97316, 0x0ea5e9, 0xe11d48, 0x22c55e]

    for (let i = 0; i < 8; i++) {
      const containerMaterial = new THREE.MeshLambertMaterial({
        color: containerColors[i % containerColors.length],
      })
      const container = new THREE.Mesh(containerGeometry, containerMaterial)

      container.position.x = (Math.random() - 0.5) * 100
      container.position.z = (Math.random() - 0.5) * 100
      container.position.y = -5 + Math.random() * 2

      container.rotation.y = Math.random() * Math.PI * 2

      scene.add(container)
      containers.push(container)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 50, 50)
    scene.add(directionalLight)

    // Camera position
    camera.position.set(0, 20, 30)
    camera.lookAt(0, -5, 0)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Update ocean animation
      oceanMaterial.uniforms.time.value = elapsedTime

      // Animate containers
      containers.forEach((container, index) => {
        container.position.y = -5 + Math.sin(elapsedTime * 0.5 + index) * 1.5
        container.rotation.z = Math.sin(elapsedTime * 0.3 + index) * 0.1

        // Move containers slowly
        container.position.x += Math.sin(elapsedTime * 0.1 + index) * 0.01
        container.position.z += Math.cos(elapsedTime * 0.1 + index) * 0.01

        // Reset position if too far
        if (container.position.x > 100) container.position.x = -100
        if (container.position.x < -100) container.position.x = 100
        if (container.position.z > 100) container.position.z = -100
        if (container.position.z < -100) container.position.z = 100
      })

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
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #4682B4 50%, #191970 100%)" }}
    />
  )
}
