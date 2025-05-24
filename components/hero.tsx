"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { Rocket, Stars, Navigation, Sparkles } from "lucide-react"
import RealisticOceanBackground from "./realistic-ocean-background"
import ModernOverlay from "./modern-overlay"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Check if WebGL2 is supported
    const testCanvas = document.createElement('canvas');
    if (!testCanvas.getContext('webgl2')) {
      console.log("WebGL2 not supported, consider a fallback.");
    }

    // Animation setup
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })

      gsap.from(".hero-description", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power4.out",
      })

      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "power4.out",
      })
    }, containerRef)

    setIsLoaded(true)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden aurora-bg">
      {/* Ocean Background */}
      {isLoaded && <RealisticOceanBackground />}
      
      {/* Modern UI Overlay */}
      {isLoaded && <ModernOverlay />}

      {/* Content overlay */}
      <div className="relative z-30 container mx-auto px-4 h-full flex flex-col justify-center">
        <div ref={containerRef} className="max-w-3xl">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 cosmic-text-gradient animate-holographic-shimmer drop-shadow-lg">
            Navigate the Future of Maritime Logistics
          </h1>
          <p className="hero-description text-xl md:text-2xl text-foreground/90 mb-8 drop-shadow-md">
            Streamline your shipping operations with our cutting-edge logistics platform
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="btn-primary-cosmic">
              <Rocket className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button size="lg" className="btn-outline-cosmic">
              <Stars className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Cosmic Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--particle-x': `${Math.random() * 200 - 100}px`,
              '--particle-y': `${Math.random() * -200 - 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
