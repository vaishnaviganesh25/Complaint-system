"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"

// Remove the onCanvasClick prop from the interface
interface SmartDashboardProps {
  children: React.ReactNode
  notesCount: number
}

// Remove the onCanvasClick parameter and handleCanvasClick function
export function SmartDashboard({ children, notesCount }: SmartDashboardProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dashboardSize, setDashboardSize] = useState({ width: 1200, height: 800 })
  const [zoom, setZoom] = useState(1)

  // Smart expansion based on note density and screen size
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const baseSize = isMobile ? { width: 800, height: 600 } : { width: 1200, height: 800 }
    const notesPerArea = isMobile ? 3 : 6 // Fewer notes per area on mobile
    const expansionNeeded = Math.ceil(notesCount / notesPerArea)

    if (expansionNeeded > 1) {
      const expansionFactor = Math.sqrt(expansionNeeded)
      setDashboardSize({
        width: Math.floor(baseSize.width * expansionFactor),
        height: Math.floor(baseSize.height * expansionFactor),
      })
    } else {
      setDashboardSize(baseSize)
    }
  }, [notesCount])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.3), 2))
  }, [])

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <div
        ref={canvasRef}
        className="relative bg-gradient-to-br from-pink-50 to-pink-100 min-h-full"
        onWheel={handleWheel}
        style={{
          width: `${dashboardSize.width}px`,
          height: `${dashboardSize.height}px`,
          backgroundImage: `
            radial-gradient(circle at 20px 20px, #FFB6C1 1px, transparent 1px),
            radial-gradient(circle at 60px 60px, #FFB6C1 0.5px, transparent 0.5px)
          `,
          backgroundSize: window.innerWidth < 768 ? "60px 60px, 30px 30px" : "80px 80px, 40px 40px",
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>

      {/* Zoom controls - Mobile responsive */}
      <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2 z-50">
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.2, 2))}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg text-sm sm:text-base"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.3))}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg text-sm sm:text-base"
        >
          -
        </button>
        <div className="text-xs text-center text-pink-600 mt-1">{Math.round(zoom * 100)}%</div>
      </div>

      {/* Dashboard info - Mobile responsive */}
      <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 bg-pink-100/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 text-xs text-pink-600">
        <span className="hidden sm:inline">Dashboard: </span>
        {dashboardSize.width} × {dashboardSize.height}
      </div>
    </div>
  )
}
