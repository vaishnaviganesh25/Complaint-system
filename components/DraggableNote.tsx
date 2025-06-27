"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, MessageCircle, Grip, Upload, Image, Video, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Component {
  type: "title" | "text" | "video" | "image" | "divider"
  content: string
  order: number
  color?: string
}

interface Comment {
  id: string
  text: string
  author: string
  timestamp: number
  reactions: { emoji: string; count: number }[]
}

interface NoteProps {
  id: string
  components: Component[]
  color: string
  x: number
  y: number
  width: number
  height: number
  severity: "mild" | "moderate" | "serious" | "critical" | "nuclear"
  scoldingType: "custom" | "bolimaga" | "horri" | "nin_saaya" | "nin_bojja"
  customScolding?: string
  pinId?: string
  reactions: { emoji: string; count: number }[]
  comments: Comment[]
  commentsExpanded: boolean
  isPinned: boolean
  timestamp: number
  onUpdate: (id: string, updates: any) => void
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
  onComment: (id: string, comment: string) => void
  onDrag: (id: string, x: number, y: number) => void
}

const NOTE_COLORS = {
  yellow: "bg-yellow-100 border-yellow-300",
  pink: "bg-pink-100 border-pink-300",
  mint: "bg-green-100 border-green-300",
  lavender: "bg-purple-100 border-purple-300",
  peach: "bg-orange-100 border-orange-300",
  sky: "bg-blue-100 border-blue-300",
  rose: "bg-rose-100 border-rose-300",
  lime: "bg-lime-100 border-lime-300",
  coral: "bg-red-100 border-red-300",
  teal: "bg-teal-100 border-teal-300",
  red: "bg-red-100 border-red-400",
}

const TEXT_COLORS = {
  black: "#000000",
  pink: "#FF69B4",
  purple: "#9370DB",
  blue: "#4169E1",
  green: "#32CD32",
  orange: "#FF8C00",
  red: "#DC143C",
}

const SEVERITY_COLORS = {
  mild: "border-l-green-400",
  moderate: "border-l-yellow-400",
  serious: "border-l-orange-400",
  critical: "border-l-red-400",
  nuclear: "border-l-purple-600",
}

const SCOLDING_OPTIONS = {
  bolimaga: "Bolimaga! 😤",
  horri: "Horri! 🙄",
  nin_saaya: "Nin Saaya! 😒",
  nin_bojja: "Nin Bojja! 🤨",
}

const REACTION_EMOJIS = ["❤️", "😂", "👍", "🔥", "😡", "😢", "🤔", "👏"]

export function DraggableNote(props: NoteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showUploadArea, setShowUploadArea] = useState<number | null>(null)
  const [mediaInputMode, setMediaInputMode] = useState<{ [key: number]: 'url' | 'upload' | null }>({})
  const [uploading, setUploading] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the drag handle or note header
    const target = e.target as HTMLElement
    if (target.closest(".drag-handle") || target.closest(".note-header")) {
      e.preventDefault()
      e.stopPropagation()

      // Immediate visual feedback
      if (noteRef.current) {
        noteRef.current.style.transform = `${noteRef.current.style.transform} scale(1.02)`
        noteRef.current.style.zIndex = "999"
      }

      setIsDragging(true)
      setDragStart({
        x: e.clientX - props.x,
        y: e.clientY - props.y,
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Touch support for mobile devices
    const target = e.target as HTMLElement
    if (target.closest(".drag-handle") || target.closest(".note-header")) {
      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      if (noteRef.current) {
        noteRef.current.style.transform = `${noteRef.current.style.transform} scale(1.02)`
        noteRef.current.style.zIndex = "999"
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
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
        const touch = e.touches[0]
        const newX = Math.max(0, touch.clientX - dragStart.x)
        const newY = Math.max(0, touch.clientY - dragStart.y)
        props.onDrag(props.id, newX, newY)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        // Reset visual feedback
        if (noteRef.current) {
          noteRef.current.style.transform = noteRef.current.style.transform.replace(" scale(1.02)", "")
          noteRef.current.style.zIndex = "10"
        }
      }
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false)
        // Reset visual feedback
        if (noteRef.current) {
          noteRef.current.style.transform = noteRef.current.style.transform.replace(" scale(1.02)", "")
          noteRef.current.style.zIndex = "10"
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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = props.width
    const startHeight = props.height

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const newWidth = Math.max(350, startWidth + (e.clientX - startX))
      const newHeight = Math.max(300, startHeight + (e.clientY - startY))
      props.onUpdate(props.id, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "default"
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "se-resize"
  }

  const addComponent = (type: Component["type"], mode?: 'url' | 'upload') => {
    const newComponent: Component = {
      type,
      content: type === "title" ? "New Title" : type === "text" ? "New text..." : "",
      order: props.components.length,
      color: "#000000",
    }
    
    const updatedComponents = [...props.components, newComponent]
    props.onUpdate(props.id, {
      components: updatedComponents,
    })

    // If this is a media component, set the input mode
    if ((type === "video" || type === "image") && mode) {
      const newIndex = updatedComponents.length - 1
      setMediaInputMode(prev => ({ ...prev, [newIndex]: mode }))
      if (mode === 'upload') {
        setShowUploadArea(newIndex)
      }
    }
  }

  const handleFileUpload = async (file: File, index: number) => {
    setUploading(true)
    try {
      // Mock upload for now - replace with actual upload logic
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      updateComponent(index, { content: result.url })
      setShowUploadArea(null)
      setMediaInputMode(prev => ({ ...prev, [index]: null }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const setInputMode = (index: number, mode: 'url' | 'upload') => {
    setMediaInputMode(prev => ({ ...prev, [index]: mode }))
    if (mode === 'upload') {
      setShowUploadArea(index)
    } else {
      setShowUploadArea(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      handleFileUpload(file, index)
    }
  }

  const updateComponent = (index: number, updates: Partial<Component>) => {
    const updatedComponents = [...props.components]
    updatedComponents[index] = { ...updatedComponents[index], ...updates }
    props.onUpdate(props.id, { components: updatedComponents })
  }

  const deleteComponent = (index: number) => {
    const updatedComponents = props.components.filter((_, i) => i !== index)
    props.onUpdate(props.id, { components: updatedComponents })
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-2xl rounded-2xl border-3 border-l-6 ${NOTE_COLORS[props.color as keyof typeof NOTE_COLORS]} ${SEVERITY_COLORS[props.severity]} ${isDragging ? "scale-105 z-50 shadow-pink-300/50" : "z-10"} ${props.isPinned ? "ring-3 ring-pink-400 ring-opacity-50" : ""} transition-all duration-300 hover:shadow-pink-200/30 hover:shadow-2xl backdrop-blur-sm hover:z-20`}
      style={{
        left: `${props.x}px`,
        top: `${props.y}px`,
        width: window.innerWidth < 768 ? `${Math.min(props.width, window.innerWidth - 40)}px` : `${props.width}px`,
        minHeight: `${props.height}px`,
        minWidth: window.innerWidth < 768 ? "280px" : "350px",
        maxWidth: window.innerWidth < 768 ? `${window.innerWidth - 40}px` : "none",
        transform: `rotate(${Math.random() * 4 - 2}deg)`,
        cursor: isDragging ? "grabbing" : "default",
        boxShadow: isDragging
          ? "0 25px 50px -12px rgba(255, 105, 180, 0.25), 0 0 0 1px rgba(255, 105, 180, 0.1)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Note Header - Mobile responsive */}
      <div
        className="note-header flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border-b-2 border-pink-200 cursor-grab active:cursor-grabbing bg-gradient-to-r from-pink-50/50 to-transparent rounded-t-2xl gap-2 sm:gap-0"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
          <div className="drag-handle">
            <Grip className="text-pink-400 cursor-grab hover:text-pink-600 transition-colors" size={16} />
          </div>
          <Select value={props.severity} onValueChange={(value) => props.onUpdate(props.id, { severity: value })}>
            <SelectTrigger
              className="w-24 sm:w-32 h-7 sm:h-8 text-xs sm:text-sm border-pink-200 focus:border-pink-400"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">😊 Mild</SelectItem>
              <SelectItem value="moderate">😐 Moderate</SelectItem>
              <SelectItem value="serious">😠 Serious</SelectItem>
              <SelectItem value="critical">🤬 Critical</SelectItem>
              <SelectItem value="nuclear">💥 Nuclear</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile responsive color palette */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <div className="grid grid-cols-6 gap-0.5 sm:gap-1 p-1 sm:p-2 bg-white/80 rounded-lg border border-pink-200">
            {Object.keys(NOTE_COLORS).map((color) => (
              <button
                key={color}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 hover:scale-110 transition-transform ${NOTE_COLORS[color as keyof typeof NOTE_COLORS]} ${props.color === color ? "ring-1 sm:ring-2 ring-pink-400 ring-offset-1" : "border-gray-300"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  props.onUpdate(props.id, { color })
                }}
              />
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              props.onDelete(props.id)
            }}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-full transition-all ml-1 sm:ml-2"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scolding Section */}
      <div className="p-4 border-b border-pink-200 bg-gradient-to-r from-pink-50/30 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-pink-600">Scolding Type:</span>
          <Select
            value={props.scoldingType}
            onValueChange={(value) => props.onUpdate(props.id, { scoldingType: value })}
          >
            <SelectTrigger className="w-36 h-7 text-sm border-pink-200" onClick={(e) => e.stopPropagation()}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="bolimaga">Bolimaga</SelectItem>
              <SelectItem value="horri">Horri</SelectItem>
              <SelectItem value="nin_saaya">Nin Saaya</SelectItem>
              <SelectItem value="nin_bojja">Nin Bojja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {props.scoldingType === "custom" ? (
          <Input
            value={props.customScolding || ""}
            onChange={(e) => props.onUpdate(props.id, { customScolding: e.target.value })}
            placeholder="Write your custom scolding..."
            className="text-sm border-pink-200 focus:border-pink-400"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm font-medium text-pink-700 bg-pink-100/50 p-2 rounded-lg">
            {SCOLDING_OPTIONS[props.scoldingType as keyof typeof SCOLDING_OPTIONS]}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="p-4 space-y-3" style={{ minHeight: `${props.height - 350}px` }}>
        {props.components.map((component, index) => (
          <div key={index} className="group relative">
            {component.type === "title" && (
              <div className="space-y-2">
                <Input
                  value={component.content}
                  onChange={(e) => updateComponent(index, { content: e.target.value })}
                  className="font-bold text-xl border-none shadow-none p-0 bg-transparent focus:bg-pink-50/30 rounded-lg"
                  placeholder="Title..."
                  style={{ color: component.color || "#000000" }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(TEXT_COLORS).map(([name, color]) => (
                    <button
                      key={name}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        updateComponent(index, { color })
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {component.type === "text" && (
              <div className="space-y-2">
                <Textarea
                  value={component.content}
                  onChange={(e) => updateComponent(index, { content: e.target.value })}
                  className="border-none shadow-none p-2 bg-transparent resize-none text-base focus:bg-pink-50/30 rounded-lg"
                  placeholder="Write your complaint..."
                  style={{ color: component.color || "#000000" }}
                  rows={4}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(TEXT_COLORS).map(([name, color]) => (
                    <button
                      key={name}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        updateComponent(index, { color })
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {component.type === "video" && (
              <div className="space-y-2">
                {component.content ? (
                  <div className="relative group p-2 bg-white rounded-lg border-2 border-gray-200 shadow-lg">
                    <video 
                      src={component.content} 
                      controls 
                      className="w-full h-auto rounded-md max-h-56 bg-gray-100"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateComponent(index, { content: "" })
                        setMediaInputMode(prev => ({ ...prev, [index]: null }))
                      }}
                      className="absolute top-3 right-3 h-6 w-6 p-0 bg-red-500 text-white border-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg border border-gray-200">
                    <div className="text-center text-sm font-medium text-gray-700">Add Video</div>
                    
                    {mediaInputMode[index] === 'url' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600 font-medium">🔗 Paste Video URL</label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMediaInputMode(prev => ({ ...prev, [index]: null }))
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          value={component.content}
                          onChange={(e) => updateComponent(index, { content: e.target.value })}
                          placeholder="https://example.com/video.mp4"
                          className="text-xs"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    )}
                    
                    {mediaInputMode[index] === 'upload' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600 font-medium">🎥 Upload Video File</label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMediaInputMode(prev => ({ ...prev, [index]: null }))
                              setShowUploadArea(null)
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, index)
                          }}
                          className="hidden"
                          id={`video-upload-${index}`}
                        />
                        <label
                          htmlFor={`video-upload-${index}`}
                          className="block w-full p-6 border-2 border-dashed border-pink-300 rounded-lg text-center cursor-pointer hover:border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100/50 transition-all hover:shadow-md"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <Video className="h-10 w-10 mx-auto mb-3 text-pink-500" />
                          <span className="text-sm text-pink-600 font-medium block mb-1">Choose video file or drag & drop</span>
                          <div className="text-xs text-pink-400">MP4, WebM, AVI (max 10MB)</div>
                          {uploading && (
                            <div className="mt-2 text-xs text-pink-500 font-medium">Uploading...</div>
                          )}
                        </label>
                      </div>
                    )}

                    {!mediaInputMode[index] && (
                      <div className="text-center text-xs text-gray-500">
                        This video component is ready. Use buttons above to add URL or upload a file.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {component.type === "image" && (
              <div className="space-y-2">
                {component.content ? (
                  <div className="relative group p-2 bg-white rounded-lg border-2 border-gray-200 shadow-lg">
                    <img 
                      src={component.content} 
                      alt="Uploaded content" 
                      className="w-full h-auto rounded-md max-h-56 object-cover bg-gray-100"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateComponent(index, { content: "" })
                        setMediaInputMode(prev => ({ ...prev, [index]: null }))
                      }}
                      className="absolute top-3 right-3 h-6 w-6 p-0 bg-red-500 text-white border-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg border border-gray-200">
                    <div className="text-center text-sm font-medium text-gray-700">Add Image</div>
                    
                    {mediaInputMode[index] === 'url' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600 font-medium">🔗 Paste Image URL</label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMediaInputMode(prev => ({ ...prev, [index]: null }))
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          value={component.content}
                          onChange={(e) => updateComponent(index, { content: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="text-xs"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    )}
                    
                    {mediaInputMode[index] === 'upload' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600 font-medium">🖼️ Upload Image File</label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMediaInputMode(prev => ({ ...prev, [index]: null }))
                              setShowUploadArea(null)
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, index)
                          }}
                          className="hidden"
                          id={`image-upload-${index}`}
                        />
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="block w-full p-6 border-2 border-dashed border-pink-300 rounded-lg text-center cursor-pointer hover:border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100/50 transition-all hover:shadow-md"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <Image className="h-10 w-10 mx-auto mb-3 text-pink-500" />
                          <span className="text-sm text-pink-600 font-medium block mb-1">Choose image file or drag & drop</span>
                          <div className="text-xs text-pink-400">JPG, PNG, GIF (max 10MB)</div>
                          {uploading && (
                            <div className="mt-2 text-xs text-pink-500 font-medium">Uploading...</div>
                          )}
                        </label>
                      </div>
                    )}

                    {!mediaInputMode[index] && (
                      <div className="text-center text-xs text-gray-500">
                        This image component is ready. Use buttons above to add URL or upload a file.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {component.type === "divider" && <hr className="border-pink-300 my-3" />}

            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteComponent(index)
              }}
              className="absolute -right-2 -top-2 w-5 h-5 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add Component Buttons - Mobile responsive */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 p-2 bg-pink-50/30 rounded-lg">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("title")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-pink-200 hover:bg-pink-100"
          >
            📝 <span className="hidden xs:inline">Title</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("text")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-pink-200 hover:bg-pink-100"
          >
            📄 <span className="hidden xs:inline">Text</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("video", "upload")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-pink-200 bg-pink-100/50 hover:bg-pink-100"
          >
            🎥 <span className="hidden xs:inline">Video</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("video", "url")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-blue-200 bg-blue-100/50 hover:bg-blue-100"
          >
            🔗 <span className="hidden sm:inline">Video URL</span><span className="sm:hidden">VU</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("image", "upload")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-pink-200 bg-pink-100/50 hover:bg-pink-100"
          >
            🖼️ <span className="hidden xs:inline">Image</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("image", "url")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-blue-200 bg-blue-100/50 hover:bg-blue-100"
          >
            🔗 <span className="hidden sm:inline">Image URL</span><span className="sm:hidden">IU</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addComponent("divider")
            }}
            className="text-xs h-6 sm:h-7 px-2 sm:px-3 border-pink-200 hover:bg-pink-100"
          >
            ➖ <span className="hidden xs:inline">Divider</span>
          </Button>
        </div>
      </div>

      {/* Reactions - Mobile responsive */}
      <div className="p-2 sm:p-4 border-t border-pink-200 bg-gradient-to-r from-pink-50/30 to-transparent">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {REACTION_EMOJIS.map((emoji) => {
            const reaction = props.reactions.find((r) => r.emoji === emoji)
            return (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation()
                  props.onReact(props.id, emoji)
                }}
                className={`px-1 sm:px-2 py-1 rounded-full text-xs sm:text-sm transition-all hover:scale-105 ${
                  reaction && reaction.count > 0
                    ? "bg-pink-200 text-pink-700 shadow-sm"
                    : "bg-pink-50 hover:bg-pink-100"
                }`}
              >
                {emoji} {reaction && reaction.count > 0 ? reaction.count : ""}
              </button>
            )
          })}
        </div>

        {/* Comments Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.onUpdate(props.id, { commentsExpanded: !props.commentsExpanded })
          }}
          className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 bg-pink-100/50 px-3 py-1 rounded-full transition-colors"
        >
          <MessageCircle size={14} />
          Comments ({props.comments.length})
        </button>

        {/* Comments Section - Fixed spacing and no overlap */}
        {props.commentsExpanded && (
          <div className="mt-3 space-y-2 max-h-40 overflow-y-auto bg-white/80 rounded-lg p-3 border border-pink-200 z-10 relative">
            {props.comments.map((comment) => (
              <div key={comment.id} className="bg-pink-50/80 p-3 rounded-lg text-sm border border-pink-100 mb-2">
                <div className="font-medium text-pink-700">{comment.author}</div>
                <div className="text-pink-600 mt-1 break-words">{comment.text}</div>
                <div className="text-pink-400 text-xs mt-2">{formatTimestamp(comment.timestamp)}</div>
              </div>
            ))}

            <div className="flex gap-2 mt-3 sticky bottom-0 bg-white/90 p-2 rounded-lg border border-pink-200">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="text-sm h-8 border-pink-200 flex-1"
                onClick={(e) => e.stopPropagation()}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    props.onComment(props.id, newComment)
                    setNewComment("")
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  if (newComment.trim()) {
                    props.onComment(props.id, newComment)
                    setNewComment("")
                  }
                }}
                className="h-8 px-3 text-xs bg-pink-500 hover:bg-pink-600"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-5 h-5 bg-pink-400 cursor-se-resize opacity-60 hover:opacity-100 transition-opacity rounded-tl-lg"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      />

      {/* Fixed Timestamp */}
      <div className="absolute bottom-2 left-3 text-xs text-pink-500 bg-white/80 px-2 py-1 rounded-full">
        {formatTimestamp(props.timestamp)}
      </div>
    </div>
  )
}
