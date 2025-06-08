// Global variables
let currentPage = 0
let isTransitioning = false
let navigationEnabled = true
let mousePosition = { x: 0, y: 0 }
let isMouseMoving = false
let touchStart = null
let touchEnd = null
let mouseMoveTimeout = null

// Page data
const pages = [
  { id: "home", title: "AI Study Companion" },
  { id: "notes", title: "Notes Uploader" },
  { id: "companion", title: "AI Companion" },
  { id: "stats", title: "Performance Stats" },
  { id: "pyqs", title: "PYQs" },
  { id: "profile", title: "Your Profile" },
  { id: "contact", title: "Contact Us" },
  { id: "disclaimer", title: "Disclaimer" },
]

// Math symbols for animation
const mathSymbols = ["π", "∑", "∫", "∆", "∞", "√", "±", "≈", "≠", "≤", "≥", "α", "β", "γ", "θ"]

// Gradient classes
const gradients = [
  "gradient-0",
  "gradient-1",
  "gradient-2",
  "gradient-3",
  "gradient-4",
  "gradient-5",
  "gradient-6",
  "gradient-7",
]

// University images
const universityImages = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EMIT%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EIIT%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EOxford%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EStanford%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EHarvard%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3ECambridge%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3ECaltech%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23333'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EPrinceton%3C/text%3E%3C/svg%3E",
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Initialize mouse position to center
  mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

  // Set up event listeners
  setupEventListeners()

  // Initialize animations
  initializeMathSymbols()
  initializeParticles()
  initializeInteractiveCanvas()

  // Update initial state
  updatePageState()
  updateCustomCursor()
}

function setupEventListeners() {
  // Mouse movement
  document.addEventListener("mousemove", handleMouseMove)

  // Wheel scroll
  document.addEventListener("wheel", handleWheel, { passive: false })

  // Touch events
  document.addEventListener("touchstart", handleTouchStart, { passive: true })
  document.addEventListener("touchmove", handleTouchMove, { passive: true })
  document.addEventListener("touchend", handleTouchEnd, { passive: true })

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyDown)

  // Window resize
  window.addEventListener("resize", handleResize)
}

function handleMouseMove(e) {
  mousePosition = { x: e.clientX, y: e.clientY }
  isMouseMoving = true

  updateCustomCursor()
  updateParallaxElements()
  updateMouseTrail()
  updateInteractiveCanvas()
  updateParticles()

  // Clear existing timeout
  if (mouseMoveTimeout) {
    clearTimeout(mouseMoveTimeout)
  }

  // Set mouse as not moving after 100ms
  mouseMoveTimeout = setTimeout(() => {
    isMouseMoving = false
  }, 100)
}

function handleWheel(e) {
  e.preventDefault()

  if (isTransitioning || !navigationEnabled) return

  // Debounce wheel events
  setTimeout(() => {
    if (e.deltaY > 50 && currentPage < pages.length - 1) {
      navigateToPage(currentPage + 1)
    } else if (e.deltaY < -50 && currentPage > 0) {
      navigateToPage(currentPage - 1)
    }
  }, 50)
}

function handleTouchStart(e) {
  if (!navigationEnabled) return
  touchEnd = null
  touchStart = e.touches[0].clientY
}

function handleTouchMove(e) {
  if (!navigationEnabled) return
  touchEnd = e.touches[0].clientY
}

function handleTouchEnd() {
  if (!touchStart || !touchEnd || !navigationEnabled) return

  const distance = touchStart - touchEnd
  const minSwipeDistance = 80

  if (distance > minSwipeDistance && currentPage < pages.length - 1) {
    navigateToPage(currentPage + 1)
  } else if (distance < -minSwipeDistance && currentPage > 0) {
    navigateToPage(currentPage - 1)
  }
}

function handleKeyDown(e) {
  if (isTransitioning || !navigationEnabled) return

  if (e.key === "ArrowDown" && currentPage < pages.length - 1) {
    navigateToPage(currentPage + 1)
  } else if (e.key === "ArrowUp" && currentPage > 0) {
    navigateToPage(currentPage - 1)
  }
}

function handleResize() {
  // Reinitialize canvas and particles on resize
  initializeInteractiveCanvas()
  initializeParticles()
}

function navigateToPage(pageIndex) {
  if (pageIndex === currentPage || isTransitioning || !navigationEnabled) return

  // Disable navigation during transition
  navigationEnabled = false
  isTransitioning = true

  // Show transition overlay
  const overlay = document.getElementById("transition-overlay")
  const mainContent = document.getElementById("main-content")

  overlay.classList.add("active")
  mainContent.classList.add("transitioning")

  // First phase - fade out
  setTimeout(() => {
    currentPage = pageIndex
    updatePageState()

    // Second phase - fade in
    setTimeout(() => {
      overlay.classList.remove("active")
      mainContent.classList.remove("transitioning")
      isTransitioning = false
      navigationEnabled = true
    }, 600)
  }, 400)
}

function updatePageState() {
  // Update active page
  document.querySelectorAll(".page").forEach((page, index) => {
    if (index === currentPage) {
      page.classList.add("active")
    } else {
      page.classList.remove("active")
    }
  })

  // Update page indicators
  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    if (index === currentPage) {
      indicator.classList.add("active")
    } else {
      indicator.classList.remove("active")
    }
  })

  // Update page counter
  const counter = document.getElementById("page-counter")
  counter.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`

  // Update background gradient
  const background = document.getElementById("animated-background")
  background.className = `animated-background ${gradients[currentPage]}`

  // Update university background
  const universityBg = document.getElementById("university-background")
  universityBg.style.backgroundImage = `url(${universityImages[currentPage]})`
}

function updateCustomCursor() {
  const cursor = document.querySelector("body::after")
  if (cursor) {
    cursor.style.transform = `translate(${mousePosition.x - 10}px, ${mousePosition.y - 10}px)`
  }
}

function updateParallaxElements() {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  // Update main title
  const mainTitle = document.getElementById("main-title")
  if (mainTitle) {
    const deltaX = (mousePosition.x - centerX) * 0.02
    const deltaY = (mousePosition.y - centerY) * 0.02
    mainTitle.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  // Update sub title
  const subTitle = document.getElementById("sub-title")
  if (subTitle) {
    const deltaX = (mousePosition.x - centerX) * -0.01
    const deltaY = (mousePosition.y - centerY) * -0.01
    subTitle.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  // Update hero icon
  const heroIcon = document.getElementById("hero-icon")
  if (heroIcon) {
    const deltaX = (mousePosition.x - centerX) * 0.03
    const deltaY = (mousePosition.y - centerY) * 0.03
    const scale = 1 + (isMouseMoving ? 0.1 : 0)
    heroIcon.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`
  }

  // Update buttons
  const getStartedBtn = document.getElementById("get-started-btn")
  if (getStartedBtn) {
    const deltaX = (mousePosition.x - centerX) * 0.01
    const deltaY = (mousePosition.y - centerY) * 0.01
    getStartedBtn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  const knowMoreBtn = document.getElementById("know-more-btn")
  if (knowMoreBtn) {
    const deltaX = (mousePosition.x - centerX) * -0.01
    const deltaY = (mousePosition.y - centerY) * -0.01
    knowMoreBtn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  // Update page indicators
  const indicators = document.getElementById("page-indicators")
  if (indicators) {
    const deltaX = (mousePosition.x - centerX) * 0.005
    const deltaY = (mousePosition.y - centerY) * 0.005
    indicators.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) translateY(-50%)`
  }

  // Update page counter
  const counter = document.getElementById("page-counter")
  if (counter) {
    const deltaX = (mousePosition.x - centerX) * 0.01
    const deltaY = (mousePosition.y - centerY) * 0.01
    counter.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  // Update university background
  const universityBg = document.getElementById("university-background")
  if (universityBg) {
    const deltaX = (mousePosition.x - centerX) * -0.005
    const deltaY = (mousePosition.y - centerY) * -0.005
    universityBg.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  // Update page icons and content
  document.querySelectorAll(".page-icon").forEach((icon) => {
    const deltaX = (mousePosition.x - centerX) * 0.02
    const deltaY = (mousePosition.y - centerY) * 0.02
    const scale = 1 + (isMouseMoving ? 0.05 : 0)
    icon.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`
  })

  document.querySelectorAll(".page-title").forEach((title) => {
    const deltaX = (mousePosition.x - centerX) * 0.01
    const deltaY = (mousePosition.y - centerY) * 0.01
    title.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  })

  document.querySelectorAll(".page-description").forEach((desc) => {
    const deltaX = (mousePosition.x - centerX) * -0.005
    const deltaY = (mousePosition.y - centerY) * -0.005
    desc.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  })
}

function updateMouseTrail() {
  if (!isMouseMoving) return

  const trail = document.getElementById("mouse-trail")

  // Create new trail point
  const point = document.createElement("div")
  point.className = "trail-point"
  point.style.left = mousePosition.x - 4 + "px"
  point.style.top = mousePosition.y - 4 + "px"
  point.style.opacity = "0.3"

  trail.appendChild(point)

  // Remove old trail points
  const points = trail.querySelectorAll(".trail-point")
  if (points.length > 8) {
    points[0].remove()
  }

  // Fade out trail points
  points.forEach((p, index) => {
    const opacity = ((points.length - index) / points.length) * 0.3
    p.style.opacity = opacity
  })

  // Remove trail point after animation
  setTimeout(() => {
    if (point.parentNode) {
      point.remove()
    }
  }, 300)
}

function initializeMathSymbols() {
  const container = document.getElementById("math-symbols")
  container.innerHTML = ""

  mathSymbols.forEach((symbol, index) => {
    const element = document.createElement("div")
    element.className = "math-symbol"
    element.textContent = symbol

    // Distribute symbols evenly across screen width
    const segmentWidth = window.innerWidth / mathSymbols.length
    const startX = segmentWidth * index + Math.random() * (segmentWidth * 0.8)
    const startY = -100 - (index % 3) * 200
    const fallSpeed = 0.8 + (index % 5) * 0.3

    element.style.left = "0px"
    element.style.top = "0px"
    element.style.transform = `translate3d(${startX}px, ${startY}px, 0)`

    container.appendChild(element)

    // Animate the symbol
    animateMathSymbol(element, startX, startY, fallSpeed)
  })
}

function animateMathSymbol(element, startX, startY, fallSpeed) {
  let position = startY

  function animate() {
    position += fallSpeed

    // Reset position when symbol goes off screen
    if (position > window.innerHeight + 100) {
      position = -100
    }

    const rotation = Math.sin(position * 0.01) * 15
    element.style.transform = `translate3d(${startX}px, ${position}px, 0) rotate(${rotation}deg)`

    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

function initializeParticles() {
  const container = document.getElementById("particles-container")
  container.innerHTML = ""

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * window.innerWidth + "px"
    particle.style.top = Math.random() * window.innerHeight + "px"

    container.appendChild(particle)
  }
}

function updateParticles() {
  const particles = document.querySelectorAll(".particle")

  particles.forEach((particle, index) => {
    const rect = particle.getBoundingClientRect()
    const particleX = rect.left + rect.width / 2
    const particleY = rect.top + rect.height / 2

    const distance = Math.sqrt(Math.pow(mousePosition.x - particleX, 2) + Math.pow(mousePosition.y - particleY, 2))

    // Only attract if mouse is within 300px
    if (distance < 300) {
      const attraction = Math.max(0.02, 0.1 - distance / 3000)
      const newX = particleX + (mousePosition.x - particleX) * attraction
      const newY = particleY + (mousePosition.y - particleY) * attraction

      particle.style.transform = `translate3d(${newX - particleX}px, ${newY - particleY}px, 0)`
    }
  })
}

function initializeInteractiveCanvas() {
  const canvas = document.getElementById("interactive-canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  updateInteractiveCanvas()
}

function updateInteractiveCanvas() {
  const canvas = document.getElementById("interactive-canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Create gradient based on mouse position
  const gradient = ctx.createRadialGradient(mousePosition.x, mousePosition.y, 0, mousePosition.x, mousePosition.y, 200)

  // Different colors based on current page
  const colors = [
    ["rgba(255, 165, 0, 0.1)", "rgba(255, 20, 147, 0.05)"],
    ["rgba(0, 191, 255, 0.1)", "rgba(138, 43, 226, 0.05)"],
    ["rgba(50, 205, 50, 0.1)", "rgba(0, 0, 255, 0.05)"],
    ["rgba(255, 215, 0, 0.1)", "rgba(255, 69, 0, 0.05)"],
    ["rgba(255, 20, 147, 0.1)", "rgba(255, 0, 0, 0.05)"],
    ["rgba(138, 43, 226, 0.1)", "rgba(255, 20, 147, 0.05)"],
    ["rgba(75, 0, 130, 0.1)", "rgba(138, 43, 226, 0.05)"],
    ["rgba(0, 128, 128, 0.1)", "rgba(0, 0, 255, 0.05)"],
  ]

  gradient.addColorStop(0, colors[currentPage][0])
  gradient.addColorStop(1, colors[currentPage][1])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// Utility function to update cursor position
function updateCursorPosition() {
  const style = document.createElement("style")
  style.textContent = `
        body::after {
            transform: translate(${mousePosition.x - 10}px, ${mousePosition.y - 10}px) !important;
        }
    `
  document.head.appendChild(style)

  // Remove the style after a short delay to prevent accumulation
  setTimeout(() => {
    document.head.removeChild(style)
  }, 100)
}

// Update cursor position on mouse move
document.addEventListener("mousemove", updateCursorPosition)

// Initialize on load
window.addEventListener("load", initializeApp)
