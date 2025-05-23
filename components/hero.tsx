"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { Anchor, Compass, Ship, Navigation } from "lucide-react"
import OceanBackground from "./ocean-background"
import CSSOceanFallback from "./css-ocean-fallback"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [useThreeJS, setUseThreeJS] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Check if Three.js is available
    try {
      // Test if Three.js can create a basic scene
      const THREE = (window as any).THREE
      const testRenderer = THREE ? new THREE.WebGLRenderer({ alpha: true }) : null
      if (!testRenderer) {
        setUseThreeJS(false)
      } else {
        testRenderer.dispose()
      }
    } catch (error) {
      console.log("Three.js not available, using CSS fallback")
      setUseThreeJS(false)
    }

    // Text animations
    const animateText = () => {
      const title = document.querySelector(".hero-title")
      const subtitle = document.querySelector(".hero-subtitle")
      const buttons = document.querySelectorAll(".hero-button")
      const icons = document.querySelectorAll(".hero-icon")

      gsap.fromTo(title, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })

      gsap.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" })

      gsap.fromTo(
        buttons,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, stagger: 0.2, ease: "power3.out" },
      )

      gsap.fromTo(
        icons,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 1, stagger: 0.15, ease: "back.out(1.7)" },
      )
    }

    setTimeout(animateText, 500)
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Ocean Background - Three.js or CSS fallback */}
      {useThreeJS ? <OceanBackground /> : <CSSOceanFallback />}

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="flex items-center mb-6 space-x-4">
            <div className="flex space-x-3">
              <div className="hero-icon bg-black-900/80 backdrop-blur-sm p-3 rounded-full">
                <Anchor className="h-6 w-6 text-orange-500" />
              </div>
              <div className="hero-icon bg-black-900/80 backdrop-blur-sm p-3 rounded-full">
                <Ship className="h-6 w-6 text-orange-500" />
              </div>
              <div className="hero-icon bg-black-900/80 backdrop-blur-sm p-3 rounded-full">
                <Compass className="h-6 w-6 text-orange-500 compass-animation" />
              </div>
              <div className="hero-icon bg-black-900/80 backdrop-blur-sm p-3 rounded-full">
                <Navigation className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 opacity-0 text-white drop-shadow-lg">
            <span className="ocean-text-gradient">Oceanic</span> Excellence in Maritime Solutions
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl mb-8 opacity-0 text-white/90 max-w-2xl drop-shadow-md">
            Expert maritime consultancy from Master Mariners and Chief Engineers with over two decades of experience
            across all vessel types
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="hero-button btn-orange opacity-0 text-base px-8 py-6 rounded-full shadow-lg">
              Explore Our Services
            </Button>
            <Button className="hero-button bg-black-900/80 backdrop-blur-sm hover:bg-black-900 text-white border border-orange-500/30 opacity-0 text-base px-8 py-6 rounded-full shadow-lg">
              Get a Consultation
            </Button>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black-900/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-orange-500 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:border-l-8 shadow-xl">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">20+</h3>
              <p className="text-white/80">Years of Experience</p>
            </div>
            <div className="bg-black-900/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-orange-500 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:border-l-8 shadow-xl">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">100+</h3>
              <p className="text-white/80">Vessels Managed</p>
            </div>
            <div className="bg-black-900/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-orange-500 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:border-l-8 shadow-xl">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">24/7</h3>
              <p className="text-white/80">Global Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black-900/50 via-black-900/30 to-black-900/20 z-[5]" />
    </div>
  )
}
