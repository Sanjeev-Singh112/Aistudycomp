"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, Brain, TrendingUp, FileText, User, Mail, AlertTriangle } from "lucide-react"

const pages = [
  { id: "home", title: "AI Study Companion", icon: Brain },
  { id: "notes", title: "Notes Uploader", icon: BookOpen },
  { id: "companion", title: "AI Companion", icon: Brain },
  { id: "stats", title: "Performance Stats", icon: TrendingUp },
  { id: "pyqs", title: "PYQs", icon: FileText },
  { id: "profile", title: "Your Profile", icon: User },
  { id: "contact", title: "Contact Us", icon: Mail },
  { id: "disclaimer", title: "Disclaimer", icon: AlertTriangle },
]

const RainingMathSymbol = ({ symbol, index, maxSymbols }: { symbol: string; index: number; maxSymbols: number }) => {
  const symbolRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Memoize initial values to prevent recalculations
  const initialValues = useMemo(() => {
    if (typeof window === "undefined") {
      return { startX: 100, startY: -100, fallSpeed: 1 }
    }

    // Distribute symbols evenly across the screen width
    const segmentWidth = window.innerWidth / maxSymbols
    const startX = segmentWidth * index + Math.random() * (segmentWidth * 0.8)

    // Stagger starting positions vertically
    const startY = -100 - (index % 3) * 200

    // Vary speeds slightly but keep them consistent
    const fallSpeed = 0.8 + (index % 5) * 0.3

    return { startX, startY, fallSpeed }
  }, [index, maxSymbols, isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!symbolRef.current || !isClient || typeof window === "undefined") return

    let position = initialValues.startY
    const { startX, fallSpeed } = initialValues

    const animate = () => {
      position += fallSpeed

      // Reset position when symbol goes off screen
      if (position > window.innerHeight + 100) {
        position = -100
      }

      if (symbolRef.current) {
        // Use transform for hardware acceleration
        symbolRef.current.style.transform = `translate3d(${startX}px, ${position}px, 0) rotate(${Math.sin(position * 0.01) * 15}deg)`
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initialValues, isClient])

  if (!isClient) {
    return null
  }

  return (
    <div
      ref={symbolRef}
      className="fixed text-white/10 text-2xl md:text-3xl font-bold select-none pointer-events-none z-10 will-change-transform"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${initialValues.startX}px, ${initialValues.startY}px, 0)`,
      }}
    >
      {symbol}
    </div>
  )
}

const InteractiveParticle = ({ index, mousePosition }: { index: number; mousePosition: { x: number; y: number } }) => {
  const particleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize random position
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    setPosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    })
  }, [isClient])

  // Follow mouse with delay and distance-based attraction
  useEffect(() => {
    if (!particleRef.current || !isClient || typeof window === "undefined") return

    const updatePosition = () => {
      const distance = Math.sqrt(Math.pow(mousePosition.x - position.x, 2) + Math.pow(mousePosition.y - position.y, 2))

      // Only attract if mouse is within 300px
      if (distance < 300) {
        const attraction = Math.max(0.02, 0.1 - distance / 3000)
        const newX = position.x + (mousePosition.x - position.x) * attraction
        const newY = position.y + (mousePosition.y - position.y) * attraction

        setPosition({ x: newX, y: newY })
      }
    }

    const animationFrame = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(animationFrame)
  }, [mousePosition, position, isClient])

  if (!isClient) {
    return null
  }

  return (
    <div
      ref={particleRef}
      className="fixed w-1 h-1 bg-white/20 rounded-full pointer-events-none z-15 will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  )
}

const MouseTrail = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const newPoint = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: Date.now(),
    }

    setTrail((prev) => {
      const newTrail = [newPoint, ...prev.slice(0, 8)] // Keep only last 8 points
      return newTrail
    })
  }, [mousePosition, isClient])

  if (!isClient) {
    return null
  }

  return (
    <>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-15 will-change-transform"
          style={{
            transform: `translate3d(${point.x - 4}px, ${point.y - 4}px, 0)`,
            opacity: ((trail.length - index) / trail.length) * 0.3,
            transition: "opacity 0.3s ease-out",
          }}
        />
      ))}
    </>
  )
}

const InteractiveBackground = ({
  mousePosition,
  currentPage,
}: { mousePosition: { x: number; y: number }; currentPage: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gradient = ctx.createRadialGradient(
      mousePosition.x,
      mousePosition.y,
      0,
      mousePosition.x,
      mousePosition.y,
      200,
    )

    // Different colors based on current page
    const colors = [
      ["rgba(255, 165, 0, 0.1)", "rgba(255, 20, 147, 0.05)"], // Orange to Pink
      ["rgba(0, 191, 255, 0.1)", "rgba(138, 43, 226, 0.05)"], // Blue to Purple
      ["rgba(50, 205, 50, 0.1)", "rgba(0, 0, 255, 0.05)"], // Green to Blue
      ["rgba(255, 215, 0, 0.1)", "rgba(255, 69, 0, 0.05)"], // Yellow to Orange
      ["rgba(255, 20, 147, 0.1)", "rgba(255, 0, 0, 0.05)"], // Pink to Red
      ["rgba(138, 43, 226, 0.1)", "rgba(255, 20, 147, 0.05)"], // Purple to Pink
      ["rgba(75, 0, 130, 0.1)", "rgba(138, 43, 226, 0.05)"], // Indigo to Purple
      ["rgba(0, 128, 128, 0.1)", "rgba(0, 0, 255, 0.05)"], // Teal to Blue
    ]

    gradient.addColorStop(0, colors[currentPage][0])
    gradient.addColorStop(1, colors[currentPage][1])

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [mousePosition, currentPage, isClient])

  if (!isClient) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5 will-change-transform"
      style={{ mixBlendMode: "screen" }}
    />
  )
}

export default function AIStudyCompanion() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigationEnabledRef = useRef(true)
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
    // Initialize mouse position to center of screen
    if (typeof window !== "undefined") {
      setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
  }, [])

  // Limit number of math symbols for better performance
  const mathSymbols = useMemo(() => ["π", "∑", "∫", "∆", "∞", "√", "±", "≈", "≠", "≤", "≥", "α", "β", "γ", "θ"], [])

  const gradients = useMemo(
    () => [
      "from-orange-400 via-pink-500 to-red-500",
      "from-blue-500 via-purple-500 to-pink-500",
      "from-green-400 via-blue-500 to-purple-600",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-pink-400 via-red-500 to-yellow-500",
      "from-purple-400 via-pink-500 to-red-500",
      "from-indigo-400 via-purple-500 to-pink-500",
      "from-teal-400 via-blue-500 to-purple-600",
    ],
    [],
  )

  const universityImages = useMemo(
    () => [
      "/placeholder.svg?height=400&width=600&text=MIT",
      "/placeholder.svg?height=400&width=600&text=IIT",
      "/placeholder.svg?height=400&width=600&text=Oxford",
      "/placeholder.svg?height=400&width=600&text=Stanford",
      "/placeholder.svg?height=400&width=600&text=Harvard",
      "/placeholder.svg?height=400&width=600&text=Cambridge",
      "/placeholder.svg?height=400&width=600&text=Caltech",
      "/placeholder.svg?height=400&width=600&text=Princeton",
    ],
    [],
  )

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
    setIsMouseMoving(true)

    // Clear existing timeout
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current)
    }

    // Set mouse as not moving after 100ms of no movement
    mouseMoveTimeoutRef.current = setTimeout(() => {
      setIsMouseMoving(false)
    }, 100)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
    }
  }, [handleMouseMove, isClient])

  const navigateToPage = (pageIndex: number) => {
    if (pageIndex === currentPage || isTransitioning || !navigationEnabledRef.current) return

    // Disable navigation during transition
    navigationEnabledRef.current = false
    setIsTransitioning(true)

    // Use requestAnimationFrame for smoother transitions
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        // First phase - fade out
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)

        transitionTimeoutRef.current = setTimeout(() => {
          setCurrentPage(pageIndex)

          // Second phase - fade in
          transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false)
            navigationEnabledRef.current = true
          }, 600)
        }, 400)
      })
    }
  }

  // Handle wheel scroll with debounce
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    let wheelTimeout: NodeJS.Timeout | null = null

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isTransitioning || !navigationEnabledRef.current) return

      // Debounce wheel events
      if (wheelTimeout) clearTimeout(wheelTimeout)

      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 50 && currentPage < pages.length - 1) {
          navigateToPage(currentPage + 1)
        } else if (e.deltaY < -50 && currentPage > 0) {
          navigateToPage(currentPage - 1)
        }
      }, 50)
    }

    document.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      document.removeEventListener("wheel", handleWheel)
      if (wheelTimeout) clearTimeout(wheelTimeout)
    }
  }, [currentPage, isTransitioning, isClient])

  // Handle touch events for mobile with improved performance
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!navigationEnabledRef.current) return
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!navigationEnabledRef.current) return
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !navigationEnabledRef.current) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 80 // Increase threshold for more intentional swipes

    if (distance > minSwipeDistance && currentPage < pages.length - 1) {
      navigateToPage(currentPage + 1)
    } else if (distance < -minSwipeDistance && currentPage > 0) {
      navigateToPage(currentPage - 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || !navigationEnabledRef.current) return

      if (e.key === "ArrowDown" && currentPage < pages.length - 1) {
        navigateToPage(currentPage + 1)
      } else if (e.key === "ArrowUp" && currentPage > 0) {
        navigateToPage(currentPage - 1)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isTransitioning, isClient])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  // Calculate parallax values safely
  const getParallaxTransform = (multiplier: number) => {
    if (!isClient || typeof window === "undefined") {
      return "translate3d(0px, 0px, 0)"
    }
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (mousePosition.x - centerX) * multiplier
    const deltaY = (mousePosition.y - centerY) * multiplier
    return `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  const renderHomePage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-8">
      <div className="mb-8">
        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider transition-all duration-300"
          style={{
            transform: getParallaxTransform(0.02),
          }}
        >
          AI Study
        </h1>
        <h2
          className="text-2xl sm:text-4xl md:text-6xl font-bold text-white/90 mb-8 transition-all duration-300"
          style={{
            transform: getParallaxTransform(-0.01),
          }}
        >
          Companion
        </h2>
        <div
          className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          style={{
            transform: `${getParallaxTransform(0.03)} scale(${1 + (isMouseMoving ? 0.1 : 0)})`,
          }}
        >
          <Brain className="w-8 h-8 md:w-12 md:h-12 text-white" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
        <Button
          onClick={() => navigateToPage(1)}
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105"
          style={{
            transform: getParallaxTransform(0.01),
          }}
        >
          Get Started
          <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
        </Button>
        <Button
          onClick={() => navigateToPage(2)}
          variant="outline"
          size="lg"
          className="bg-transparent hover:bg-white/10 text-white border-2 border-white/50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105"
          style={{
            transform: getParallaxTransform(-0.01),
          }}
        >
          Know More
        </Button>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="text-xs md:text-sm mb-2">Scroll to explore</div>
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/40 rounded-full flex justify-center mx-auto">
          <div className="w-1 h-2 md:h-3 bg-white/60 rounded-full mt-1 md:mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  const renderPage = (pageId: string, title: string, icon: any) => {
    const Icon = icon
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-8">
        <div className="mb-8">
          <div
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300"
            style={{
              transform: `${getParallaxTransform(0.02)} scale(${1 + (isMouseMoving ? 0.05 : 0)})`,
            }}
          >
            <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 transition-all duration-300"
            style={{
              transform: getParallaxTransform(0.01),
            }}
          >
            {title}
          </h1>
          <p
            className="text-base md:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl px-4 transition-all duration-300"
            style={{
              transform: getParallaxTransform(-0.005),
            }}
          >
            {getPageDescription(pageId)}
          </p>
        </div>

        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="text-xs md:text-sm mb-2">Continue scrolling</div>
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/40 rounded-full flex justify-center mx-auto">
            <div className="w-1 h-2 md:h-3 bg-white/60 rounded-full mt-1 md:mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  const getPageDescription = (pageId: string) => {
    const descriptions = {
      notes: "Upload and organize your study materials with AI-powered categorization and smart search.",
      companion: "Your personal AI tutor that adapts to your learning style and provides instant help.",
      stats: "Track your learning progress with detailed analytics and performance insights.",
      pyqs: "Access previous year questions with AI-generated solutions and explanations.",
      profile: "Customize your learning experience and track your academic journey.",
      contact: "Get in touch with our support team for any questions or assistance.",
      disclaimer: "Important information about our services and terms of use.",
    }
    return descriptions[pageId as keyof typeof descriptions] || ""
  }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative min-h-screen w-full bg-gradient-to-br from-orange-400 via-pink-500 to-red-500">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider">AI Study</h1>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white/90 mb-8">Companion</h2>
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen w-full touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Interactive Background Canvas */}
      <InteractiveBackground mousePosition={mousePosition} currentPage={currentPage} />

      {/* Animated Background - with will-change for better performance */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${gradients[currentPage]} transition-all duration-1000 ease-out will-change-transform will-change-opacity`}
      />

      {/* University Background Image - preload for smoother transitions */}
      <div
        className="fixed inset-0 opacity-10 bg-cover bg-center transition-all duration-1000 ease-out will-change-opacity"
        style={{
          backgroundImage: `url(${universityImages[currentPage]})`,
          transform: getParallaxTransform(-0.005),
        }}
      />

      {/* Mouse Trail Effect */}
      {isMouseMoving && <MouseTrail mousePosition={mousePosition} />}

      {/* Interactive Particles */}
      {Array.from({ length: 8 }).map((_, index) => (
        <InteractiveParticle key={index} index={index} mousePosition={mousePosition} />
      ))}

      {/* Raining Math Symbols - optimized for performance */}
      {mathSymbols.map((symbol, index) => (
        <RainingMathSymbol key={`${symbol}-${index}`} symbol={symbol} index={index} maxSymbols={mathSymbols.length} />
      ))}

      {/* Smooth Fade Transition Overlay - hardware accelerated */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-600 ease-out will-change-opacity ${
          isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: `radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)`,
        }}
      />

      {/* Main Content Container - hardware accelerated transforms */}
      <div
        className={`relative z-20 transition-all duration-600 ease-out will-change-transform will-change-opacity ${
          isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {currentPage === 0 && renderHomePage()}
        {currentPage > 0 && renderPage(pages[currentPage].id, pages[currentPage].title, pages[currentPage].icon)}
      </div>

      {/* Page Indicators */}
      <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 md:space-y-3 z-30">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToPage(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentPage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            style={{
              transform: getParallaxTransform(0.005),
            }}
          />
        ))}
      </div>

      {/* Page Counter */}
      <div
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 text-white/60 text-xs md:text-sm z-30 transition-all duration-300"
        style={{
          transform: getParallaxTransform(0.01),
        }}
      >
        {String(currentPage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
      </div>
    </div>
  )
}
