"use client"

import type React from "react"
import { useState, useRef } from "react"
import { X, MessageCircle, Grip, Upload, Image, Video, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFileUpload } from "@/hooks/useApi"

interface Component {
  type: "title" | "text" | "video" | "image" | "divider"
  content: string
  order: number
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
  onUpdate: (id: string, updates: any) => void
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
  onComment: (id: string, comment: string) => void
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

export function NoteComponent(props: NoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showUploadArea, setShowUploadArea] = useState<number | null>(null)
  const [mediaInputMode, setMediaInputMode] = useState<{ [key: number]: 'url' | 'upload' | null }>({})
  const noteRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const { uploadFile, uploading } = useFileUpload()

  const addComponent = (type: Component["type"], mode?: 'url' | 'upload') => {
    const newComponent: Component = {
      type,
      content: type === "title" ? "New Title" : type === "text" ? "New text..." : "",
      order: props.components.length,
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

  const updateComponent = (index: number, content: string) => {
    const updatedComponents = [...props.components]
    updatedComponents[index].content = content
    props.onUpdate(props.id, { components: updatedComponents })
  }

  const deleteComponent = (index: number) => {
    const updatedComponents = props.components.filter((_, i) => i !== index)
    props.onUpdate(props.id, { components: updatedComponents })
  }

  const handleFileUpload = async (file: File, index: number) => {
    try {
      const result = await uploadFile(file)
      updateComponent(index, result.url)
      setShowUploadArea(null)
      setMediaInputMode(prev => ({ ...prev, [index]: null }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file. Please try again.')
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

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = props.width
    const startHeight = props.height

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + (e.clientX - startX))
      const newHeight = Math.max(150, startHeight + (e.clientY - startY))
      props.onUpdate(props.id, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-lg rounded-lg border-2 border-l-4 ${NOTE_COLORS[props.color as keyof typeof NOTE_COLORS]} ${SEVERITY_COLORS[props.severity]} transform hover:scale-105 transition-all duration-200`}
      style={{
        left: `${props.x}px`,
        top: `${props.y}px`,
        width: `${props.width}px`,
        minHeight: `${props.height}px`,
        transform: `rotate(${Math.random() * 4 - 2}deg)`,
      }}
    >
      {/* Note Header */}
      <div className="flex items-center justify-between p-3 border-b border-pink-200">
        <div className="flex items-center gap-2">
          <Grip className="text-pink-400 cursor-move" size={16} />
          <Select value={props.severity} onValueChange={(value) => props.onUpdate(props.id, { severity: value })}>
            <SelectTrigger className="w-24 h-6 text-xs">
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

        <div className="flex items-center gap-1">
          {Object.keys(NOTE_COLORS).map((color) => (
            <button
              key={color}
              className={`w-3 h-3 rounded-full border ${NOTE_COLORS[color as keyof typeof NOTE_COLORS]} ${props.color === color ? "ring-1 ring-pink-400" : ""}`}
              onClick={() => props.onUpdate(props.id, { color })}
            />
          ))}
          <button onClick={() => props.onDelete(props.id)} className="text-red-400 hover:text-red-600 ml-2">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scolding Section */}
      <div className="p-3 border-b border-pink-200 bg-pink-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-pink-600">Scolding Type:</span>
          <Select
            value={props.scoldingType}
            onValueChange={(value) => props.onUpdate(props.id, { scoldingType: value })}
          >
            <SelectTrigger className="w-32 h-6 text-xs">
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
            className="text-xs"
          />
        ) : (
          <div className="text-sm font-medium text-pink-700">
            {SCOLDING_OPTIONS[props.scoldingType as keyof typeof SCOLDING_OPTIONS]}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="p-4 space-y-3" style={{ minHeight: `${props.height - 200}px` }}>
        {props.components.map((component, index) => (
          <div key={index} className="group relative space-y-2">
            {component.type === "title" && (
              <Input
                value={component.content}
                onChange={(e) => updateComponent(index, e.target.value)}
                className="font-bold text-lg border-none shadow-none p-0 bg-transparent"
                placeholder="Title..."
              />
            )}
            {component.type === "text" && (
              <Textarea
                value={component.content}
                onChange={(e) => updateComponent(index, e.target.value)}
                className="border-none shadow-none p-0 bg-transparent resize-none"
                placeholder="Write your complaint..."
                rows={3}
              />
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
                      onClick={() => {
                        updateComponent(index, "")
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
                            onClick={() => setMediaInputMode(prev => ({ ...prev, [index]: null }))}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          value={component.content}
                          onChange={(e) => updateComponent(index, e.target.value)}
                          placeholder="https://example.com/video.mp4"
                          className="text-xs"
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
                            onClick={() => {
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
                      onClick={() => {
                        updateComponent(index, "")
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
                            onClick={() => setMediaInputMode(prev => ({ ...prev, [index]: null }))}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          value={component.content}
                          onChange={(e) => updateComponent(index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="text-xs"
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
                            onClick={() => {
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
            {component.type === "divider" && <hr className="border-pink-200 my-2" />}

            <button
              onClick={() => deleteComponent(index)}
              className="absolute -right-2 -top-2 w-4 h-4 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add Component Buttons */}
        <div className="flex flex-wrap gap-2 mt-3 p-2 bg-pink-50/50 rounded-lg border border-pink-200">
          <Button size="sm" variant="outline" onClick={() => addComponent("title")} className="text-xs h-7 border-pink-200">
            📝 Title
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("text")} className="text-xs h-7 border-pink-200">
            📄 Text
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("video", "upload")} className="text-xs h-7 border-pink-200 bg-pink-100/50">
            🎥 Video
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("video", "url")} className="text-xs h-7 border-blue-200 bg-blue-100/50">
            🔗 Video URL
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("image", "upload")} className="text-xs h-7 border-pink-200 bg-pink-100/50">
            🖼️ Image
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("image", "url")} className="text-xs h-7 border-blue-200 bg-blue-100/50">
            🔗 Image URL
          </Button>
          <Button size="sm" variant="outline" onClick={() => addComponent("divider")} className="text-xs h-7 border-pink-200">
            ➖ Divider
          </Button>
        </div>
      </div>

      {/* Reactions */}
      <div className="p-3 border-t border-pink-200">
        <div className="flex flex-wrap gap-1 mb-2">
          {REACTION_EMOJIS.map((emoji) => {
            const reaction = props.reactions.find((r) => r.emoji === emoji)
            return (
              <button
                key={emoji}
                onClick={() => props.onReact(props.id, emoji)}
                className={`px-2 py-1 rounded-full text-xs transition-all ${
                  reaction && reaction.count > 0 ? "bg-pink-200 text-pink-700" : "bg-pink-50 hover:bg-pink-100"
                }`}
              >
                {emoji} {reaction && reaction.count > 0 ? reaction.count : ""}
              </button>
            )
          })}
        </div>

        {/* Comments Toggle */}
        <button
          onClick={() => props.onUpdate(props.id, { commentsExpanded: !props.commentsExpanded })}
          className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700"
        >
          <MessageCircle size={12} />
          Comments ({props.comments.length})
        </button>

        {/* Comments Section */}
        {props.commentsExpanded && (
          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
            {props.comments.map((comment) => (
              <div key={comment.id} className="bg-pink-50 p-2 rounded text-xs">
                <div className="font-medium text-pink-700">{comment.author}</div>
                <div className="text-pink-600">{comment.text}</div>
                <div className="text-pink-400 text-xs">{new Date(comment.timestamp).toLocaleString()}</div>
              </div>
            ))}

            <div className="flex gap-1">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="text-xs h-6"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    props.onComment(props.id, newComment)
                    setNewComment("")
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newComment.trim()) {
                    props.onComment(props.id, newComment)
                    setNewComment("")
                  }
                }}
                className="h-6 px-2 text-xs"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleResize}
        className="absolute bottom-0 right-0 w-4 h-4 bg-pink-300 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      />

      {/* Timestamp */}
      <div className="absolute bottom-1 left-2 text-xs text-pink-400">{new Date().toLocaleTimeString()}</div>
    </div>
  )
}
