"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"

interface LargeCanvasProps {
  children: React.ReactNode
  onCanvasClick?: (x: number, y: number) => void
  notesCount: number
}

export function LargeCanvas({ children, onCanvasClick, notesCount }: LargeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 1500 })
  const [zoom, setZoom] = useState(1)

  // Extend canvas when notes fill up
  useEffect(() => {
    const baseSize = { width: 2000, height: 1500 }
    const extensionFactor = Math.floor(notesCount / 10) // Extend every 10 notes

    setCanvasSize({
      width: baseSize.width + extensionFactor * 1000,
      height: baseSize.height + extensionFactor * 800,
    })
  }, [notesCount])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.3), 2))
  }, [])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current && onCanvasClick) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / zoom
        const y = (e.clientY - rect.top) / zoom
        onCanvasClick(x, y)
      }
    },
    [onCanvasClick, zoom],
  )

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <div
        ref={canvasRef}
        className="relative cursor-crosshair bg-gradient-to-br from-pink-50 to-pink-100"
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          backgroundImage: `
            radial-gradient(circle at 20px 20px, #FFB6C1 1px, transparent 1px),
            radial-gradient(circle at 60px 60px, #FFB6C1 0.5px, transparent 0.5px)
          `,
          backgroundSize: "80px 80px, 40px 40px",
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>

      {/* Zoom controls - Fixed position */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.2, 2))}
          className="w-10 h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.3))}
          className="w-10 h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg"
        >
          -
        </button>
      </div>
    </div>
  )
}
