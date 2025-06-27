"use client"

import type React from "react"
import { useRef, useState, useCallback } from "react"

interface InfiniteCanvasProps {
  children: React.ReactNode
  onCanvasClick?: (x: number, y: number) => void
}

export function InfiniteCanvas({ children, onCanvasClick }: InfiniteCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        setIsPanning(true)
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      }
    },
    [panOffset],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        })
      }
    },
    [isPanning, panStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.1), 3))
  }, [])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current && onCanvasClick) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - panOffset.x) / zoom
        const y = (e.clientY - rect.top - panOffset.y) / zoom
        onCanvasClick(x, y)
      }
    },
    [onCanvasClick, panOffset, zoom],
  )

  return (
    <div
      ref={canvasRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-pink-50 to-pink-100 relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, #FFB6C1 1px, transparent 1px),
          radial-gradient(circle at 60px 60px, #FFB6C1 0.5px, transparent 0.5px)
        `,
        backgroundSize: "80px 80px, 40px 40px",
      }}
    >
      <div
        className="relative"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: "5000px",
          height: "5000px",
        }}
      >
        {children}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.2, 3))}
          className="w-10 h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.1))}
          className="w-10 h-10 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          -
        </button>
      </div>
    </div>
  )
}
