"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const ModernOverlay = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add parallax effect to cards
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const cards = containerRef.current.querySelectorAll(".parallax-card")
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      cards.forEach((card) => {
        const element = card as HTMLElement
        const speed = parseFloat(element.dataset.speed || "0.05")
        const xOffset = (x - 0.5) * speed * 100
        const yOffset = (y - 0.5) * speed * 100
        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      {/* Cosmic gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Cosmic rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow mystical-rotate-animation" />
        <div className="absolute inset-4 border border-secondary/20 rounded-full animate-spin-slow mystical-rotate-animation animation-delay-1000" />
        <div className="absolute inset-8 border border-accent/20 rounded-full animate-spin-slow mystical-rotate-animation animation-delay-2000" />
      </div>

      {/* Energy ripples */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <div className="energy-ripple" />
      </div>
    </div>
  )
}

export default ModernOverlay 