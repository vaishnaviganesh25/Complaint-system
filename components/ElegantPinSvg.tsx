export function ElegantPinSvg({ className = "w-8 h-8", color = "#FF69B4" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pin head - decorative */}
      <circle cx="50" cy="20" r="12" fill={color} stroke="#FFF" strokeWidth="2" />
      <circle cx="50" cy="20" r="8" fill="#FFF" opacity="0.8" />
      <circle cx="50" cy="20" r="4" fill={color} />

      {/* Pin shaft */}
      <rect x="48" y="32" width="4" height="35" fill={color} />

      {/* Pin point */}
      <path d="M46 67 L50 80 L54 67 Z" fill={color} />

      {/* Decorative elements */}
      <circle cx="45" cy="17" r="2" fill="#FFF" opacity="0.9" />
      <circle cx="55" cy="23" r="1.5" fill="#FFF" opacity="0.7" />

      {/* Sparkles */}
      <path d="M35 15 L37 17 L35 19 L33 17 Z" fill="#FFD700" opacity="0.8" />
      <path d="M65 25 L67 27 L65 29 L63 27 Z" fill="#FFD700" opacity="0.8" />

      {/* Shadow */}
      <ellipse cx="52" cy="82" rx="6" ry="2" fill="#000" opacity="0.2" />
    </svg>
  )
}
