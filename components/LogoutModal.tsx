"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const shinchanRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Animate modal entrance
      gsap.fromTo(
        modalRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)" },
      )

      // Animate Shin-chan
      if (shinchanRef.current) {
        gsap.to(shinchanRef.current, {
          y: -10,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
        })
      }

      // Auto close after 8 seconds instead of 4
      const timer = setTimeout(() => {
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-8 shadow-2xl border-4 border-pink-300 max-w-md mx-4 text-center"
      >
        <img
          ref={shinchanRef}
          src="/images/shinchan-balloons.webp"
          alt="Shin-chan with balloons"
          className="w-32 h-32 mx-auto mb-4 object-contain"
          crossOrigin="anonymous"
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Aww! Don't go! 🥺
          </h2>

          <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
            <p className="text-pink-700 text-lg font-medium" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Your bf is a lil immature but he's trying his best! 💕
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-pink-500">
            <span className="text-2xl animate-bounce">💖</span>
            <p className="font-medium">Come back soon, Vaishnavi!</p>
            <span className="text-2xl animate-bounce delay-300">💖</span>
          </div>
        </div>
      </div>
    </div>
  )
}
