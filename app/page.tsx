"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Plus, LogOut, PinIcon as PinSvg } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  CatSvg,
  SleepyCatSvg,
  PlayfulCatSvg,
  CuriousCatSvg,
  HappyCatSvg,
  QueenSvg,
  KingSvg,
  RabbitSvg,
  PandaSvg,
  RedHeartSvg,
} from "@/components/CatSvg"
import {
  ButterflyPinkSvg,
  ButterflyBlueSvg,
  LoveBirdSvg,
  LoveBirdPairSvg,
  DragonflySvg,
} from "@/components/FlyingCreatures"
import { SmartDashboard } from "@/components/SmartDashboard"
import { DraggableNote } from "@/components/DraggableNote"
import { DraggablePin } from "@/components/DraggablePin"
import { gsap } from "gsap"
import { LogoutModal } from "@/components/LogoutModal"
import { useWorkspaces, useNotes, usePins } from "@/hooks/useApi"


interface Note {
  id: string
  components: Array<{
    type: "title" | "text" | "video" | "image" | "divider"
    content: string
    order: number
    color?: string
  }>
  color: string
  x: number
  y: number
  width: number
  height: number
  severity: "mild" | "moderate" | "serious" | "critical" | "nuclear"
  scoldingType: "custom" | "bolimaga" | "horri" | "nin_saaya" | "nin_bojja"
  customScolding?: string
  pinId?: string
  reactions: Array<{ emoji: string; count: number }>
  comments: Array<{
    id: string
    text: string
    author: string
    timestamp: number
    reactions: Array<{ emoji: string; count: number }>
  }>
  commentsExpanded: boolean
  timestamp: number
}

interface Pin {
  id: string
  name: string
  x: number
  y: number
  color: string
  clubbedNoteIds: string[]
}

interface Workspace {
  id: string
  name: string
  notes: Note[]
  pins: Pin[]
}

const SECRET_CODE = "vaisH@206"

export default function ComplaintsCorner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [secretCode, setSecretCode] = useState("")
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>("")
  const [showLogin, setShowLogin] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const logoutRef = useRef<HTMLDivElement>(null)
  const loginCatsRef = useRef<HTMLDivElement[]>([])
  const heartTrailRef = useRef<HTMLDivElement[]>([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)

  // API hooks
  const { workspaces, loading, error, setWorkspaces, fetchWorkspaces, createWorkspace } = useWorkspaces()
  const { createNote: apiCreateNote, updateNote: apiUpdateNote, deleteNote: apiDeleteNote } = useNotes()
  const { createPin: apiCreatePin, updatePin: apiUpdatePin, deletePin: apiDeletePin } = usePins()

  const currentWorkspace = workspaces.find((w: Workspace) => w.id === currentWorkspaceId)
  const notes = currentWorkspace?.notes || []
  const pins = currentWorkspace?.pins || []

  // Handle tab visibility to optimize performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
      
      // Clean up animations when tab becomes hidden
      if (document.hidden) {
        // Stop GSAP animations
        gsap.killTweensOf("*")
        
        // Remove any floating elements
        const floatingElements = document.querySelectorAll('[style*="position: fixed"]')
        floatingElements.forEach((element) => {
          if (element.parentNode === document.body && !element.closest('.login-card') && !element.closest('header') && !element.closest('main') && !element.closest('footer')) {
            document.body.removeChild(element)
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Mouse tracking for heart trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isTabVisible) return // Don't create hearts when tab is not visible
      
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create heart trail
      if (Math.random() > 0.7) {
        // 30% chance to create heart
        createHeartTrail(e.clientX, e.clientY)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [isTabVisible])

  // Character splitting animation for login page
  useEffect(() => {
    if (showLogin && isTabVisible) {
      const createSplittingChars = () => {
        if (!isTabVisible) return // Don't create animations when tab is not visible
        const characters = ["V", "a", "i", "s", "h", "n", "a", "v", "i"]

        characters.forEach((char, index) => {
          const charElement = document.createElement("div")
          charElement.innerHTML = char
          charElement.style.position = "fixed"
          charElement.style.fontSize = "28px"
          charElement.style.fontWeight = "bold"
          charElement.style.color = "#FF69B4"
          charElement.style.fontFamily = "Comic Sans MS, cursive"
          charElement.style.textShadow = "2px 2px 4px rgba(0,0,0,0.3)"
          charElement.style.left = Math.random() * window.innerWidth + "px"
          charElement.style.top = Math.random() * window.innerHeight + "px"
          charElement.style.pointerEvents = "none"
          charElement.style.zIndex = "999"
          document.body.appendChild(charElement)

          gsap.to(charElement, {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            rotation: Math.random() * 360,
            scale: Math.random() * 1.5 + 0.5,
            opacity: 0,
            duration: 4 + Math.random() * 2,
            ease: "power2.out",
            delay: index * 0.2,
            onComplete: () => {
              if (document.body.contains(charElement)) {
                document.body.removeChild(charElement)
              }
            },
          })
        })

        // Add hearts too
        for (let i = 0; i < 5; i++) {
          const heart = document.createElement("div")
          heart.innerHTML = "💖"
          heart.style.position = "fixed"
          heart.style.fontSize = "24px"
          heart.style.left = Math.random() * window.innerWidth + "px"
          heart.style.top = Math.random() * window.innerHeight + "px"
          heart.style.pointerEvents = "none"
          heart.style.zIndex = "999"
          document.body.appendChild(heart)

          gsap.to(heart, {
            x: `+=${Math.random() * 150 - 75}`,
            y: `+=${Math.random() * 150 - 75}`,
            rotation: Math.random() * 180,
            scale: Math.random() * 1.2 + 0.8,
            opacity: 0,
            duration: 3 + Math.random() * 2,
            ease: "power2.out",
            delay: i * 0.3,
            onComplete: () => {
              if (document.body.contains(heart)) {
                document.body.removeChild(heart)
              }
            },
          })
        }
      }

      const interval = setInterval(createSplittingChars, 2000)
      return () => clearInterval(interval)
    }
  }, [showLogin, isTabVisible])

  const createHeartTrail = (x: number, y: number) => {
    if (!isTabVisible) return // Don't create heart trail when tab is not visible
    
    const characters = ["V", "a", "i", "s", "h", "n", "a", "v", "i"]
    const randomChar = characters[Math.floor(Math.random() * characters.length)]

    const heart = document.createElement("div")
    heart.innerHTML = Math.random() > 0.5 ? "💖" : randomChar
    heart.style.position = "fixed"
    heart.style.left = x + "px"
    heart.style.top = y + "px"
    heart.style.fontSize = Math.random() > 0.5 ? "18px" : "24px" // Larger size
    heart.style.fontWeight = "bold"
    heart.style.pointerEvents = "none"
    heart.style.zIndex = "9999"
    heart.style.color = Math.random() > 0.5 ? "#FF69B4" : "#DC143C"
    heart.style.textShadow = "2px 2px 4px rgba(0,0,0,0.3)"
    document.body.appendChild(heart)

    gsap.to(heart, {
      y: y - 80, // Higher float
      opacity: 0,
      scale: 0.3,
      rotation: Math.random() * 360,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        if (document.body.contains(heart)) {
          document.body.removeChild(heart)
        }
      },
    })
  }

  // Create floating heart balloons when typing secret code
  const createHeartBalloons = () => {
    if (!isTabVisible) return // Don't create balloons when tab is not visible
    
    for (let i = 0; i < 8; i++) {
      const balloon = document.createElement("div")
      balloon.innerHTML = "🎈💖"
      balloon.style.position = "fixed"
      balloon.style.left = Math.random() * window.innerWidth + "px"
      balloon.style.top = window.innerHeight + "px"
      balloon.style.fontSize = "32px" // Bigger balloons
      balloon.style.pointerEvents = "none"
      balloon.style.zIndex = "9998"
      document.body.appendChild(balloon)

      gsap.to(balloon, {
        y: -400, // Much higher float
        x: `+=${Math.random() * 300 - 150}`,
        rotation: Math.random() * 720,
        duration: 6 + Math.random() * 3,
        ease: "power2.out",
        delay: i * 0.3,
        onComplete: () => {
          if (document.body.contains(balloon)) {
            document.body.removeChild(balloon)
          }
        },
      })
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem("vaishnavi-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      setShowLogin(false)
      loadData()
    }
  }, [])

  // Remove localStorage workspaces backup - using MongoDB only
  // No localStorage fallback or caching

  // Animate cats when typing in login + heart balloons
  useEffect(() => {
    if (isTyping && showLogin && isTabVisible) {
      createHeartBalloons()

      loginCatsRef.current.forEach((cat: HTMLDivElement | null, index: number) => {
        if (cat) {
          gsap.to(cat, {
            x: `+=${Math.random() * 30 - 15}`,
            y: `+=${Math.random() * 30 - 15}`,
            rotation: `+=${Math.random() * 30 - 15}`,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.1,
            yoyo: true,
            repeat: 1,
          })
        }
      })
    }
  }, [isTyping, showLogin, isTabVisible])

  // Flying creatures animation
  useEffect(() => {
    const createFlyingCreature = () => {
      if (!isTabVisible) return // Don't create creatures when tab is not visible
      const creatures = [
        { component: ButterflyPinkSvg, size: "w-12 h-12" },
        { component: ButterflyBlueSvg, size: "w-12 h-12" },
        { component: LoveBirdSvg, size: "w-14 h-14" },
        { component: LoveBirdPairSvg, size: "w-16 h-12" },
        { component: DragonflySvg, size: "w-12 h-12" },
      ]

      const randomCreature = creatures[Math.floor(Math.random() * creatures.length)]

      const creatureDiv = document.createElement("div")
      creatureDiv.style.position = "fixed"
      creatureDiv.style.right = "-50px"
      creatureDiv.style.bottom = Math.random() * (window.innerHeight * 0.8) + "px"
      creatureDiv.style.pointerEvents = "none"
      creatureDiv.style.zIndex = "1000"
      creatureDiv.innerHTML = `<div class="${randomCreature.size}"></div>`

      // Create the SVG element
      const svgContainer = document.createElement("div")
      svgContainer.className = randomCreature.size

      // Add the appropriate SVG based on creature type
      if (randomCreature.component === ButterflyPinkSvg) {
        svgContainer.innerHTML = `<svg class="${randomCreature.size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="2" ry="20" fill="#8B4513" />
          <circle cx="50" cy="35" r="2" fill="#000" />
          <ellipse cx="35" cy="40" rx="12" ry="8" fill="#FF69B4" opacity="0.8" />
          <ellipse cx="35" cy="55" rx="10" ry="6" fill="#FFB6C1" opacity="0.8" />
          <ellipse cx="65" cy="40" rx="12" ry="8" fill="#FF69B4" opacity="0.8" />
          <ellipse cx="65" cy="55" rx="10" ry="6" fill="#FFB6C1" opacity="0.8" />
          <circle cx="35" cy="40" r="3" fill="#FF1493" />
          <circle cx="65" cy="40" r="3" fill="#FF1493" />
          <circle cx="35" cy="55" r="2" fill="#FF1493" />
          <circle cx="65" cy="55" r="2" fill="#FF1493" />
          <line x1="48" y1="32" x2="45" y2="28" stroke="#000" strokeWidth="1" />
          <line x1="52" y1="32" x2="55" y2="28" stroke="#000" strokeWidth="1" />
          <circle cx="45" cy="28" r="1" fill="#000" />
          <circle cx="55" cy="28" r="1" fill="#000" />
        </svg>`
      } else if (randomCreature.component === LoveBirdSvg) {
        svgContainer.innerHTML = `<svg class="${randomCreature.size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="55" rx="18" ry="25" fill="#FF69B4" />
          <circle cx="50" cy="35" r="15" fill="#FFB6C1" />
          <path d="M35 35 L25 32 L35 38 Z" fill="#FFA500" />
          <circle cx="45" cy="32" r="3" fill="#000" />
          <circle cx="46" cy="31" r="1" fill="#FFF" />
          <ellipse cx="60" cy="50" rx="8" ry="15" fill="#FF1493" />
          <ellipse cx="68" cy="65" rx="5" ry="12" fill="#FF1493" />
          <path d="M50 20 C45 15 35 15 35 25 C35 30 50 40 50 40 C50 40 65 30 65 25 C65 15 55 15 50 20 Z" fill="#DC143C" opacity="0.8" />
          <line x1="45" y1="75" x2="45" y2="85" stroke="#FFA500" strokeWidth="2" />
          <line x1="55" y1="75" x2="55" y2="85" stroke="#FFA500" strokeWidth="2" />
        </svg>`
      }
      // Add more creature types as needed...

      creatureDiv.appendChild(svgContainer)
      document.body.appendChild(creatureDiv)

      // Animate from bottom-right to top-left
      gsap.to(creatureDiv, {
        x: -window.innerWidth - 100,
        y: -window.innerHeight - 100,
        rotation: Math.random() * 360,
        duration: 8 + Math.random() * 4,
        ease: "none",
        onComplete: () => {
          if (document.body.contains(creatureDiv)) {
            document.body.removeChild(creatureDiv)
          }
        },
      })

      // Wing flapping animation for butterflies
      if (randomCreature.component === ButterflyPinkSvg || randomCreature.component === ButterflyBlueSvg) {
        gsap.to(svgContainer, {
          scaleX: 0.8,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
        })
      }
    }

    // Create creatures periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.1 && isTabVisible) {
        // 90% chance instead of 70% and only when tab is visible
        createFlyingCreature()
      }
    }, 1500) // Every 1.5 seconds instead of 3

    return () => clearInterval(interval)
  }, [isAuthenticated, isTabVisible])

  const loadData = async () => {
    try {
      // Load workspaces from MongoDB only
      const fetchedWorkspaces = await fetchWorkspaces()
      
      if (!fetchedWorkspaces || fetchedWorkspaces.length === 0) {
        // Create default workspace if none exists
        console.log('No workspaces found, creating default workspace...')
        const defaultWorkspace = await createWorkspace("My First Workspace")
        setCurrentWorkspaceId(defaultWorkspace.id)
      } else {
        // Set current workspace from fetched data
        if (fetchedWorkspaces.length > 0 && !currentWorkspaceId) {
          setCurrentWorkspaceId(fetchedWorkspaces[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to load data from MongoDB:", error)
      // No localStorage fallback - MongoDB only
      // Show error to user to fix MongoDB connection
    }
  }

  const handleLogin = () => {
    if (secretCode === SECRET_CODE) {
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement("div")
        heart.innerHTML = "💖"
        heart.style.position = "fixed"
        heart.style.fontSize = "24px"
        heart.style.left = Math.random() * window.innerWidth + "px"
        heart.style.top = Math.random() * window.innerHeight + "px"
        heart.style.pointerEvents = "none"
        heart.style.zIndex = "9999"
        document.body.appendChild(heart)

        gsap.to(heart, {
          scale: 2,
          opacity: 0,
          rotation: 360,
          duration: 1.5,
          ease: "power2.out",
          delay: i * 0.1,
          onComplete: () => {
            if (document.body.contains(heart)) {
              document.body.removeChild(heart)
            }
          },
        })
      }

      setTimeout(() => {
        setIsAuthenticated(true)
        setShowLogin(false)
        localStorage.setItem("vaishnavi-auth", "true")
        loadData()
      }, 800)
    } else {
      const loginCard = document.querySelector(".login-card")
      if (loginCard) {
        gsap.to(loginCard, {
          x: -15,
          duration: 0.1,
          yoyo: true,
          repeat: 6,
          ease: "power2.inOut",
        })
      }
      alert("Wrong secret code! Try again 💕")
    }
  }

  const handleLogout = () => {
    const container = logoutRef.current
    if (container) {
      // Create larger floating characters for 'Vaishnavi'
      const characters = ["V", "a", "i", "s", "h", "n", "a", "v", "i"]

      characters.forEach((char, index) => {
        for (let j = 0; j < 5; j++) {
          const text = document.createElement("div")
          text.innerHTML = char
          text.style.position = "fixed"
          text.style.fontSize = `${48 + Math.random() * 32}px` // Much larger
          text.style.fontWeight = "bold"
          text.style.color = "#FF69B4"
          text.style.fontFamily = "Comic Sans MS, cursive"
          text.style.textShadow = "3px 3px 6px rgba(0,0,0,0.3)"
          text.style.left = Math.random() * window.innerWidth + "px"
          text.style.top = window.innerHeight + "px"
          text.style.pointerEvents = "none"
          text.style.zIndex = "9999"
          document.body.appendChild(text)

          gsap.to(text, {
            y: -window.innerHeight - 500,
            x: `+=${Math.random() * 800 - 400}`,
            rotation: Math.random() * 1440,
            scale: Math.random() * 2 + 1,
            duration: 8 + Math.random() * 4,
            ease: "power2.out",
            delay: index * 0.2 + j * 0.1,
            onComplete: () => {
              if (document.body.contains(text)) {
                document.body.removeChild(text)
              }
            },
          })
        }
      })

      // Create heart explosion
      for (let i = 0; i < 50; i++) {
        const heart = document.createElement("div")
        heart.innerHTML = "💖"
        heart.style.position = "fixed"
        heart.style.fontSize = `${24 + Math.random() * 24}px`
        heart.style.left = Math.random() * window.innerWidth + "px"
        heart.style.top = window.innerHeight + "px"
        heart.style.pointerEvents = "none"
        heart.style.zIndex = "9999"
        document.body.appendChild(heart)

        gsap.to(heart, {
          y: -window.innerHeight - 600,
          x: `+=${Math.random() * 600 - 300}`,
          rotation: Math.random() * 1080,
          scale: Math.random() * 2.5 + 0.5,
          duration: 7 + Math.random() * 5,
          ease: "power2.out",
          delay: i * 0.05,
          onComplete: () => {
            if (document.body.contains(heart)) {
              document.body.removeChild(heart)
            }
          },
        })
      }
    }

    setTimeout(() => {
      setShowLogoutModal(true)
    }, 2000)

    setTimeout(() => {
      setIsAuthenticated(false)
      setShowLogin(true)
      setSecretCode("")
      localStorage.removeItem("vaishnavi-auth")
      setShowLogoutModal(false)
    }, 10000) // Changed from 8000 to 10000
  }

  const addWorkspace = async () => {
    try {
      console.log('Creating workspace...')
      
      // Prompt user for workspace name
      const workspaceName = prompt('Enter a name for your new workspace:', `Workspace ${workspaces.length + 1}`)
      
      if (!workspaceName || workspaceName.trim() === '') {
        console.log('Workspace creation cancelled or empty name provided')
        return
      }
      
      const newWorkspace = await createWorkspace(workspaceName.trim())
      console.log('Workspace created:', newWorkspace)
      setCurrentWorkspaceId(newWorkspace.id)
    } catch (error) {
      console.error('Failed to create workspace:', error)
      alert('Failed to create workspace. Please check your MongoDB connection.')
    }
  }

  const addNote = async (x = 100, y = 100) => {
    console.log('addNote called', { currentWorkspace, currentWorkspaceId });
    if (!currentWorkspace) {
      console.error('No current workspace available');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      components: [
        {
          type: "text" as const,
          content: "Click to edit your complaint...",
          order: 0,
          color: "#000000",
        },
      ],
      color: "yellow",
      x,
      y,
      width: 450,
      height: 350,
      severity: "mild" as const,
      scoldingType: "custom" as const,
      reactions: [],
      comments: [],
      commentsExpanded: false,
      timestamp: Date.now(),
      workspaceId: currentWorkspaceId,
    }

    try {
      console.log('Creating note with data:', newNote);
      const createdNote = await apiCreateNote(newNote)
      console.log('Note created successfully:', createdNote);
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId ? { ...workspace, notes: [...workspace.notes, createdNote] } : workspace,
        ),
      )

      setTimeout(() => {
        const noteElement = document.querySelector(`[data-note-id="${createdNote.id}"]`)
        if (noteElement) {
          gsap.fromTo(
            noteElement,
            { scale: 0, rotation: 180, opacity: 0 },
            { scale: 1, rotation: Math.random() * 4 - 2, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
          )
        }
      }, 50)
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const addPin = async () => {
    console.log('addPin called', { currentWorkspace, currentWorkspaceId });
    if (!currentWorkspace) {
      console.error('No current workspace available');
      return;
    }

    const newPin = {
      id: Date.now().toString(),
      name: `Pin ${pins.length + 1}`,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      color: "#FF69B4",
      clubbedNoteIds: [],
      workspaceId: currentWorkspaceId,
    }

    try {
      console.log('Creating pin with data:', newPin);
      const createdPin = await apiCreatePin(newPin)
      console.log('Pin created successfully:', createdPin);
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId ? { ...workspace, pins: [...workspace.pins, createdPin] } : workspace,
        ),
      )

      setTimeout(() => {
        const pinElement = document.querySelector(`[data-pin-id="${createdPin.id}"]`)
        if (pinElement) {
          gsap.fromTo(pinElement, { scale: 0, y: -50 }, { scale: 1, y: 0, duration: 0.5, ease: "bounce.out" })
        }
      }, 50)
    } catch (error) {
      console.error('Failed to create pin:', error)
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      await apiUpdateNote({ id, workspaceId: currentWorkspaceId, ...updates })
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId
            ? {
                ...workspace,
                notes: workspace.notes.map((note: Note) => (note.id === id ? { ...note, ...updates } : note)),
              }
            : workspace,
        ),
      )
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  const updatePin = async (id: string, updates: Partial<Pin>) => {
    try {
      await apiUpdatePin({ id, workspaceId: currentWorkspaceId, ...updates })
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId
            ? {
                ...workspace,
                pins: workspace.pins.map((pin: Pin) => (pin.id === id ? { ...pin, ...updates } : pin)),
              }
            : workspace,
        ),
      )
    } catch (error) {
      console.error('Failed to update pin:', error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await apiDeleteNote(id, currentWorkspaceId)
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId
            ? {
                ...workspace,
                notes: workspace.notes.filter((note: Note) => note.id !== id),
              }
            : workspace,
        ),
      )
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const deletePin = async (id: string) => {
    const pin = pins.find((p: Pin) => p.id === id)
    if (pin) {
      pin.clubbedNoteIds.forEach((noteId: string) => {
        updateNote(noteId, { pinId: undefined })
      })
    }

    try {
      await apiDeletePin(id, currentWorkspaceId)
      
      // Update local state
      setWorkspaces((prev: Workspace[]) =>
        prev.map((workspace: Workspace) =>
          workspace.id === currentWorkspaceId
            ? {
                ...workspace,
                pins: workspace.pins.filter((pin: Pin) => pin.id !== id),
              }
            : workspace,
        ),
      )
    } catch (error) {
      console.error('Failed to delete pin:', error)
    }
  }

  const handleNoteDrag = (id: string, x: number, y: number) => {
    const note = notes.find((n: Note) => n.id === id)
    if (!note) return

    if (note.pinId) {
      const pin = pins.find((p: Pin) => p.id === note.pinId)
      if (pin) {
        const pinnedNotes = notes.filter((n: Note) => n.pinId === note.pinId)
        const deltaX = x - note.x
        const deltaY = y - note.y

        pinnedNotes.forEach((pinnedNote: Note) => {
          updateNote(pinnedNote.id, {
            x: pinnedNote.x + deltaX,
            y: pinnedNote.y + deltaY,
          })
        })
      }
    } else {
      updateNote(id, { x, y })
    }
  }

  const handlePinDrag = (id: string, x: number, y: number) => {
    updatePin(id, { x, y })
  }

  const clubNotesWithPin = (pinId: string, noteIds: string[]) => {
    updatePin(pinId, { clubbedNoteIds: noteIds })
    noteIds.forEach((noteId) => {
      updateNote(noteId, { pinId })
    })
  }

  const reactToNote = (id: string, emoji: string) => {
    const note = notes.find((n: Note) => n.id === id)
    if (!note) return

    const existingReaction = note.reactions.find((r: { emoji: string; count: number }) => r.emoji === emoji)
    const updatedReactions = existingReaction
      ? note.reactions.map((r: { emoji: string; count: number }) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
      : [...note.reactions, { emoji, count: 1 }]

    updateNote(id, { reactions: updatedReactions })
  }

  const commentOnNote = (id: string, commentText: string) => {
    const note = notes.find((n: Note) => n.id === id)
    if (!note) return

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: "Harshendram",
      timestamp: Date.now(),
      reactions: [],
    }

    updateNote(id, { comments: [...note.comments, newComment] })
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden login-page">
        <style jsx global>{`
/* Red blinking cursor for login */
input[type="password"] {
  caret-color: #DC143C !important;
}
`}</style>

        {/* Animated floating Shin-chan and characters - Hidden on mobile */}
        <div ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[0] = el; }} className="absolute top-4 left-4 sm:top-10 sm:left-10 animate-bounce hidden sm:block">
          <img
            src="/images/shinchan-love-phone.webp"
            alt="Shin-chan in love"
            className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
            crossOrigin="anonymous"
          />
        </div>
        <div ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[1] = el; }} className="absolute top-4 right-4 sm:top-20 sm:right-20 animate-pulse hidden sm:block">
          <img
            src="/images/shinchan-bum.webp"
            alt="Shin-chan"
            className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
            crossOrigin="anonymous"
          />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[2] = el; }}
          className="absolute bottom-20 left-20 animate-bounce delay-1000 hidden md:block"
        >
          <PlayfulCatSvg className="w-12 h-12" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[3] = el; }}
          className="absolute bottom-10 right-10 animate-pulse delay-500 hidden md:block"
        >
          <CuriousCatSvg className="w-18 h-18" />
        </div>
        <div ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[4] = el; }} className="absolute top-1/2 left-5 animate-bounce delay-700 hidden lg:block">
          <HappyCatSvg className="w-14 h-14" />
        </div>
        <div ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[5] = el; }} className="absolute top-1/3 right-5 animate-pulse delay-300 hidden lg:block">
          <PlayfulCatSvg className="w-16 h-16" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[6] = el; }}
          className="absolute top-1/4 left-1/4 animate-bounce delay-800 hidden xl:block"
        >
          <QueenSvg className="w-14 h-14" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[7] = el; }}
          className="absolute bottom-1/4 right-1/4 animate-pulse delay-1200 hidden xl:block"
        >
          <KingSvg className="w-12 h-12" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[8] = el; }}
          className="absolute top-3/4 left-1/3 animate-bounce delay-600 hidden xl:block"
        >
          <RabbitSvg className="w-13 h-13" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[9] = el; }}
          className="absolute top-1/6 right-1/3 animate-pulse delay-900 hidden xl:block"
        >
          <PandaSvg className="w-15 h-15" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[10] = el; }}
          className="absolute bottom-1/3 left-1/6 animate-bounce delay-1100 hidden xl:block"
        >
          <RedHeartSvg className="w-10 h-10" />
        </div>
        <div
          ref={(el: HTMLDivElement | null) => { if (el) loginCatsRef.current[11] = el; }}
          className="absolute top-2/3 right-1/6 animate-pulse delay-400 hidden xl:block"
        >
          <RedHeartSvg className="w-8 h-8" />
        </div>

        <Card className="login-card w-full max-w-md mx-2 sm:mx-0 p-6 sm:p-8 bg-pink-50/90 backdrop-blur-lg border-pink-200 shadow-2xl border-2">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} />
              <h1
                className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent"
                style={{ fontFamily: "Brush Script MT, cursive" }}
              >
                𝒱𝒶𝒾𝓈𝒽𝓃𝒶𝓋𝒾
              </h1>
              <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} />
            </div>
            <p className="text-pink-600 text-lg sm:text-xl font-medium">Complaints Corner</p>
            <p className="text-pink-400 text-xs sm:text-sm mt-2">Your space to (lovingly) complain about Harshendra</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-pink-700 font-medium mb-2 text-sm sm:text-base">Enter Secret Codeword 💕</label>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => {
                  setSecretCode(e.target.value)
                  setIsTyping(e.target.value.length > 0)
                }}
                placeholder="What's our special code?"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-200 rounded-lg focus:border-pink-400 bg-pink-50/80 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
            >
              Let Me In 💖
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div ref={logoutRef} className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 dashboard-page">
      <style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #FFE4E6;
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #FF69B4;
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #FF1493;
  }
  
  /* Pink selection color - force override */
  ::selection {
    background-color: #FF69B4 !important;
    color: white !important;
  }
  ::-moz-selection {
    background-color: #FF69B4 !important;
    color: white !important;
  }
  
  /* Ensure pink selection on all elements */
  *::selection {
    background-color: #FF69B4 !important;
    color: white !important;
  }
  *::-moz-selection {
    background-color: #FF69B4 !important;
    color: white !important;
  }
  
  /* Red blinking cursor for text inputs */
  input[type="text"], input[type="password"], textarea {
    caret-color: #DC143C !important;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`}</style>

      {/* Header */}
      <header className="bg-pink-50/90 backdrop-blur-lg border-b-2 border-pink-200 shadow-lg relative">
        <div className="absolute top-1 sm:top-2 left-2 sm:left-4 animate-bounce hidden sm:block">
          <CatSvg className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="absolute top-1 sm:top-2 right-2 sm:right-4 animate-pulse hidden sm:block">
          <SleepyCatSvg className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
                <h1
                  className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent"
                  style={{ fontFamily: "Brush Script MT, cursive" }}
                >
                  𝒱𝒶𝒾𝓈𝒽𝓃𝒶𝓋𝒾
                </h1>
                <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={currentWorkspaceId} onValueChange={setCurrentWorkspaceId} disabled={loading}>
                  <SelectTrigger className="w-full sm:w-48 border-2 border-pink-200 text-sm">
                    <SelectValue placeholder={loading ? "Loading..." : "Select workspace"} />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace: any) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addWorkspace} size="sm" variant="outline" className="border-pink-300 flex-shrink-0" disabled={loading}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {loading && <span className="text-pink-500 text-xs sm:text-sm">Loading workspaces...</span>}
              {error && (
                <div className="text-red-500 text-xs sm:text-sm max-w-xs bg-red-50 p-2 rounded border text-center sm:text-left">
                  <p className="font-semibold">⚠️ Database Connection Failed</p>
                  <p className="text-xs mt-1">MongoDB authentication error. Please check MONGODB_SETUP.md for instructions.</p>
                </div>
              )}
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-100 text-sm w-full sm:w-auto"
              >
                <LogOut size={14} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="text-center mt-2">
            <p className="text-pink-600 text-lg sm:text-xl font-medium">Complaints Corner</p>
            <p className="text-pink-400 text-xs sm:text-sm mt-1">Your smart dashboard to (lovingly) complain about Harshendra</p>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)]">
        <div className="p-2 sm:p-4">
          <div className="mb-3 sm:mb-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Button
                onClick={() => addNote()}
                className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all text-sm sm:text-base py-2 sm:py-3"
              >
                <Plus size={16} className="mr-2" />
                Add New Complaint
              </Button>
              <Button
                onClick={addPin}
                className="bg-pink-400 hover:bg-pink-500 text-white shadow-lg hover:shadow-xl transition-all text-sm sm:text-base py-2 sm:py-3"
              >
                <PinSvg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Pin
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-pink-600 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="fill-pink-500 text-pink-500" />
                  {notes.reduce((sum: number, note: any) => sum + note.reactions.reduce((s: number, r: { emoji: string; count: number }) => s + r.count, 0), 0)} reactions
                </span>
                <span className="flex items-center gap-1">
                  <PlayfulCatSvg className="w-3 h-3 sm:w-4 sm:h-4" />
                  {notes.length} complaints
                </span>
                <span className="flex items-center gap-1">
                  <PinSvg className="w-3 h-3 sm:w-4 sm:h-4" />
                  {pins.length} pins
                </span>
              </div>
            </div>
          </div>
        </div>

        <SmartDashboard notesCount={notes.length}>

          {/* Render Notes */}
          {notes.map((note: any) => (
            <div key={note.id} data-note-id={note.id}>
              <DraggableNote
                {...note}
                isPinned={!!note.pinId}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onReact={reactToNote}
                onComment={commentOnNote}
                onDrag={handleNoteDrag}
              />
            </div>
          ))}

          {/* Render Pins */}
          {pins.map((pin: any) => (
            <div key={pin.id} data-pin-id={pin.id}>
              <DraggablePin
                {...pin}
                notes={notes}
                onUpdate={updatePin}
                onDelete={deletePin}
                onDrag={handlePinDrag}
                onClubNotes={clubNotesWithPin}
              />
            </div>
          ))}

          {/* Welcome message */}
          {notes.length === 0 && (
            <div className="absolute top-20 sm:top-200 left-4 sm:left-200 right-4 sm:right-auto text-center">
              <div className="bg-pink-50/90 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border-2 border-dashed border-pink-300 shadow-xl max-w-sm sm:max-w-none mx-auto">
                <CatSvg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
                <h3
                  className="text-xl sm:text-2xl font-bold text-pink-600 mb-2"
                  style={{ fontFamily: "Brush Script MT, cursive" }}
                >
                  Welcome to Your Smart Dashboard!
                </h3>
                <p className="text-pink-500 mb-4 text-sm sm:text-base">Use the "Add New Complaint" button to add your first complaint</p>
                <p className="text-pink-400 text-xs sm:text-sm">The dashboard will expand automatically as you add more notes!</p>
              </div>
            </div>
          )}
        </SmartDashboard>
      </main>

      {/* Footer - Restored, thin, transparent, dark pink border, popping heart */}
      <footer className="w-full fixed left-0 bottom-0 z-50 bg-gradient-to-r from-pink-100/70 via-fuchsia-100/60 to-red-100/60 backdrop-blur-xl shadow-2xl py-0.5 sm:py-0.5 min-h-[32px]">
        <div className="container mx-auto px-2 sm:px-4 flex flex-col items-center justify-center gap-0">
          <div className="flex items-center justify-center gap-2 h-[22px]">
            <CatSvg className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
            <SleepyCatSvg className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-0">
            <span className="footer-signature flex items-center text-xs sm:text-sm font-extrabold tracking-wide animate-gradient-text" style={{
              fontFamily: 'Dancing Script, Great Vibes, Parisienne, Pacifico, Brush Script MT, cursive',
              background: 'linear-gradient(90deg, #ffb6d5, #fbc2eb, #ffb6d5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 8px #ffd6e0, 0 1px 0 #fff',
              filter: 'drop-shadow(0 1px 4px #fbc2ebcc)'
            }}>
              <span className="mr-1 animate-heart-pop flex items-center" style={{lineHeight: 1}}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <path d="M12 21s-6.2-5.2-8.5-8.1C1.2 10.2 2.1 7 5 5.7c2.1-.9 4.1.3 5 1.7 0 0 2.1-2.6 5-1.7 2.9 1.3 3.8 4.5 1.5 7.2C18.2 15.8 12 21 12 21z" fill="#FF69B4" stroke="#F472B6" strokeWidth="1.5"/>
                </svg>
              </span>
              Made With Love by Harshendra
            </span>
          </div>
        </div>
      </footer>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  )
}
