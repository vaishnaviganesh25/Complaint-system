"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Edit2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ElegantPinSvg } from "@/components/ElegantPinSvg"
import { gsap } from "gsap"

interface PinProps {
  id: string
  name: string
  x: number
  y: number
  color: string
  clubbedNoteIds: string[]
  onUpdate: (id: string, updates: any) => void
  onDelete: (id: string) => void
  onDrag: (id: string, x: number, y: number) => void
  onClubNotes: (pinId: string, noteIds: string[]) => void
  notes: any[]
}

const PIN_COLORS = [
  "#FF69B4", // Hot Pink
  "#FF1493", // Deep Pink
  "#FFB6C1", // Light Pink
  "#FFA500", // Orange
  "#32CD32", // Lime Green
  "#4169E1", // Royal Blue
  "#9370DB", // Medium Purple
  "#FF6347", // Tomato
]

export function DraggablePin(props: PinProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(props.name)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const pinRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.preventDefault()
      e.stopPropagation()

      // Immediate visual feedback
      if (pinRef.current) {
        pinRef.current.style.transform = "scale(1.1)"
        pinRef.current.style.zIndex = "999"
      }

      setIsDragging(true)
      setDragStart({
        x: e.clientX - props.x,
        y: e.clientY - props.y,
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditing) {
      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      if (pinRef.current) {
        pinRef.current.style.transform = "scale(1.1)"
        pinRef.current.style.zIndex = "999"
      }

      setIsDragging(true)
      setDragStart({
        x: touch.clientX - props.x,
        y: touch.clientY - props.y,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const newX = Math.max(0, e.clientX - dragStart.x)
        const newY = Math.max(0, e.clientY - dragStart.y)
        props.onDrag(props.id, newX, newY)

        // Check for notes to club
        checkForNotesToClub(newX, newY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
        const touch = e.touches[0]
        const newX = Math.max(0, touch.clientX - dragStart.x)
        const newY = Math.max(0, touch.clientY - dragStart.y)
        props.onDrag(props.id, newX, newY)

        // Check for notes to club
        checkForNotesToClub(newX, newY)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        finalizeClubbing()
        // Reset visual feedback
        if (pinRef.current) {
          pinRef.current.style.transform = "scale(1)"
          pinRef.current.style.zIndex = "auto"
        }
      }
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false)
        finalizeClubbing()
        // Reset visual feedback
        if (pinRef.current) {
          pinRef.current.style.transform = "scale(1)"
          pinRef.current.style.zIndex = "auto"
        }
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
      document.body.style.cursor = "grabbing"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.body.style.cursor = "default"
    }
  }, [isDragging, dragStart, props])

  const checkForNotesToClub = (pinX: number, pinY: number) => {
    const pinCenter = { x: pinX + 20, y: pinY + 20 } // Pin center
    const clubRadius = 60 // Distance to club notes

    const nearbyNotes = props.notes.filter((note) => {
      const noteCenter = { x: note.x + note.width / 2, y: note.y + note.height / 2 }
      const distance = Math.sqrt(Math.pow(noteCenter.x - pinCenter.x, 2) + Math.pow(noteCenter.y - pinCenter.y, 2))
      return distance <= clubRadius
    })

    // Visual feedback for nearby notes
    nearbyNotes.forEach((note) => {
      const noteElement = document.querySelector(`[data-note-id="${note.id}"]`)
      if (noteElement) {
        noteElement.classList.add("ring-4", "ring-pink-300", "ring-opacity-50")
      }
    })

    // Remove visual feedback from notes that are no longer nearby
    props.notes.forEach((note) => {
      const noteCenter = { x: note.x + note.width / 2, y: note.y + note.height / 2 }
      const distance = Math.sqrt(Math.pow(noteCenter.x - pinCenter.x, 2) + Math.pow(noteCenter.y - pinCenter.y, 2))
      if (distance > clubRadius) {
        const noteElement = document.querySelector(`[data-note-id="${note.id}"]`)
        if (noteElement) {
          noteElement.classList.remove("ring-4", "ring-pink-300", "ring-opacity-50")
        }
      }
    })
  }

  const finalizeClubbing = () => {
    const pinCenter = { x: props.x + 20, y: props.y + 20 }
    const clubRadius = 60

    const nearbyNotes = props.notes.filter((note) => {
      const noteCenter = { x: note.x + note.width / 2, y: note.y + note.height / 2 }
      const distance = Math.sqrt(Math.pow(noteCenter.x - pinCenter.x, 2) + Math.pow(noteCenter.y - pinCenter.y, 2))
      return distance <= clubRadius
    })

    if (nearbyNotes.length >= 2) {
      // Club the notes with animation
      const noteIds = nearbyNotes.map((note) => note.id)
      props.onClubNotes(props.id, noteIds)

      // Show clipping notification
      const notification = document.createElement("div")
      notification.innerHTML = `🎉 ${nearbyNotes.length} notes clipped together!`
      notification.style.position = "fixed"
      notification.style.left = "50%"
      notification.style.top = "20px"
      notification.style.transform = "translateX(-50%)"
      notification.style.backgroundColor = "#FF69B4"
      notification.style.color = "white"
      notification.style.padding = "12px 24px"
      notification.style.borderRadius = "25px"
      notification.style.fontWeight = "bold"
      notification.style.fontSize = "16px"
      notification.style.zIndex = "9999"
      notification.style.boxShadow = "0 4px 12px rgba(255, 105, 180, 0.3)"
      document.body.appendChild(notification)

      gsap.fromTo(
        notification,
        { y: -50, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      )

      setTimeout(() => {
        gsap.to(notification, {
          y: -50,
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          onComplete: () => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          },
        })
      }, 3000)

      // Animate clubbing
      nearbyNotes.forEach((note, index) => {
        const noteElement = document.querySelector(`[data-note-id="${note.id}"]`)
        if (noteElement) {
          gsap.to(noteElement, {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            delay: index * 0.1,
          })

          // Add clubbed visual effect
          gsap.to(noteElement, {
            boxShadow: "0 0 20px rgba(255, 105, 180, 0.5)",
            duration: 0.5,
            delay: 0.3,
          })
        }
      })

      // Pin celebration animation
      if (pinRef.current) {
        gsap.to(pinRef.current, {
          scale: 1.3,
          rotation: 360,
          duration: 0.6,
          ease: "back.out(1.7)",
        })
      }
    }

    // Clean up visual feedback
    props.notes.forEach((note) => {
      const noteElement = document.querySelector(`[data-note-id="${note.id}"]`)
      if (noteElement) {
        noteElement.classList.remove("ring-4", "ring-pink-300", "ring-opacity-50")
      }
    })
  }

  const handleNameEdit = () => {
    if (isEditing) {
      props.onUpdate(props.id, { name: editName })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleColorChange = (color: string) => {
    props.onUpdate(props.id, { color })
  }

  return (
    <div
      ref={pinRef}
      className={`absolute group ${isDragging ? "z-50 scale-110" : ""} transition-all duration-200`}
      style={{
        left: `${props.x}px`,
        top: `${props.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Pin SVG - Mobile responsive */}
      <div className="relative">
        <ElegantPinSvg className="w-8 h-8 sm:w-10 sm:h-10" color={props.color} />

        {/* Clubbed notes indicator - Mobile responsive */}
        {props.clubbedNoteIds.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-pink-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
            {props.clubbedNoteIds.length}
          </div>
        )}
      </div>

      {/* Pin Info Panel - Mobile responsive */}
      <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 bg-pink-50 border border-pink-200 rounded-lg p-1 sm:p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-28 sm:min-w-32 z-50">
        {/* Name - Mobile responsive */}
        <div className="flex items-center gap-1 mb-1 sm:mb-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xs h-5 sm:h-6 w-16 sm:w-20"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleNameEdit()
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNameEdit()
                }}
                className="text-green-500 hover:text-green-600"
              >
                <Check size={10} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditName(props.name)
                  setIsEditing(false)
                }}
                className="text-red-500 hover:text-red-600"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-pink-700 truncate max-w-16 sm:max-w-20">{props.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNameEdit()
                }}
                className="text-pink-500 hover:text-pink-600"
              >
                <Edit2 size={8} />
              </button>
            </div>
          )}
        </div>

        {/* Color Picker - Mobile responsive */}
        <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {PIN_COLORS.map((color) => (
            <button
              key={color}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border ${props.color === color ? "ring-1 ring-gray-400" : ""}`}
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation()
                handleColorChange(color)
              }}
            />
          ))}
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.onDelete(props.id)
          }}
          className="text-xs text-red-500 hover:text-red-600 w-full text-center"
        >
          Delete Pin
        </button>
      </div>

      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded">
          Drop on 2+ notes to club them!
        </div>
      )}
    </div>
  )
}
