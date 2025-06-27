export function ButterflyPinkSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="50" rx="2" ry="20" fill="#8B4513" />
      <circle cx="50" cy="35" r="2" fill="#000" />

      {/* Left wings */}
      <ellipse cx="35" cy="40" rx="12" ry="8" fill="#FF69B4" opacity="0.8" />
      <ellipse cx="35" cy="55" rx="10" ry="6" fill="#FFB6C1" opacity="0.8" />

      {/* Right wings */}
      <ellipse cx="65" cy="40" rx="12" ry="8" fill="#FF69B4" opacity="0.8" />
      <ellipse cx="65" cy="55" rx="10" ry="6" fill="#FFB6C1" opacity="0.8" />

      {/* Wing patterns */}
      <circle cx="35" cy="40" r="3" fill="#FF1493" />
      <circle cx="65" cy="40" r="3" fill="#FF1493" />
      <circle cx="35" cy="55" r="2" fill="#FF1493" />
      <circle cx="65" cy="55" r="2" fill="#FF1493" />

      {/* Antennae */}
      <line x1="48" y1="32" x2="45" y2="28" stroke="#000" strokeWidth="1" />
      <line x1="52" y1="32" x2="55" y2="28" stroke="#000" strokeWidth="1" />
      <circle cx="45" cy="28" r="1" fill="#000" />
      <circle cx="55" cy="28" r="1" fill="#000" />
    </svg>
  )
}

export function ButterflyBlueSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="50" rx="2" ry="20" fill="#8B4513" />
      <circle cx="50" cy="35" r="2" fill="#000" />

      {/* Left wings */}
      <ellipse cx="35" cy="40" rx="12" ry="8" fill="#4169E1" opacity="0.8" />
      <ellipse cx="35" cy="55" rx="10" ry="6" fill="#87CEEB" opacity="0.8" />

      {/* Right wings */}
      <ellipse cx="65" cy="40" rx="12" ry="8" fill="#4169E1" opacity="0.8" />
      <ellipse cx="65" cy="55" rx="10" ry="6" fill="#87CEEB" opacity="0.8" />

      {/* Wing patterns */}
      <circle cx="35" cy="40" r="3" fill="#0000FF" />
      <circle cx="65" cy="40" r="3" fill="#0000FF" />
      <circle cx="35" cy="55" r="2" fill="#0000FF" />
      <circle cx="65" cy="55" r="2" fill="#0000FF" />

      {/* Antennae */}
      <line x1="48" y1="32" x2="45" y2="28" stroke="#000" strokeWidth="1" />
      <line x1="52" y1="32" x2="55" y2="28" stroke="#000" strokeWidth="1" />
      <circle cx="45" cy="28" r="1" fill="#000" />
      <circle cx="55" cy="28" r="1" fill="#000" />
    </svg>
  )
}

export function LoveBirdSvg({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bird body */}
      <ellipse cx="50" cy="55" rx="18" ry="25" fill="#FF69B4" />

      {/* Bird head */}
      <circle cx="50" cy="35" r="15" fill="#FFB6C1" />

      {/* Beak */}
      <path d="M35 35 L25 32 L35 38 Z" fill="#FFA500" />

      {/* Eye */}
      <circle cx="45" cy="32" r="3" fill="#000" />
      <circle cx="46" cy="31" r="1" fill="#FFF" />

      {/* Wing */}
      <ellipse cx="60" cy="50" rx="8" ry="15" fill="#FF1493" />

      {/* Tail */}
      <ellipse cx="68" cy="65" rx="5" ry="12" fill="#FF1493" />

      {/* Heart above */}
      <path
        d="M50 20 C45 15 35 15 35 25 C35 30 50 40 50 40 C50 40 65 30 65 25 C65 15 55 15 50 20 Z"
        fill="#DC143C"
        opacity="0.8"
      />

      {/* Legs */}
      <line x1="45" y1="75" x2="45" y2="85" stroke="#FFA500" strokeWidth="2" />
      <line x1="55" y1="75" x2="55" y2="85" stroke="#FFA500" strokeWidth="2" />
    </svg>
  )
}

export function LoveBirdPairSvg({ className = "w-12 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* First bird */}
      <ellipse cx="35" cy="55" rx="15" ry="20" fill="#FF69B4" />
      <circle cx="35" cy="40" r="12" fill="#FFB6C1" />
      <path d="M23 40 L15 37 L23 43 Z" fill="#FFA500" />
      <circle cx="32" cy="37" r="2" fill="#000" />
      <circle cx="33" cy="36" r="0.5" fill="#FFF" />
      <ellipse cx="45" cy="50" rx="6" ry="12" fill="#FF1493" />

      {/* Second bird */}
      <ellipse cx="85" cy="55" rx="15" ry="20" fill="#4169E1" />
      <circle cx="85" cy="40" r="12" fill="#87CEEB" />
      <path d="M97 40 L105 37 L97 43 Z" fill="#FFA500" />
      <circle cx="88" cy="37" r="2" fill="#000" />
      <circle cx="87" cy="36" r="0.5" fill="#FFF" />
      <ellipse cx="75" cy="50" rx="6" ry="12" fill="#0000FF" />

      {/* Shared heart */}
      <path d="M60 25 C55 20 45 20 45 30 C45 35 60 45 60 45 C60 45 75 35 75 30 C75 20 65 20 60 25 Z" fill="#DC143C" />

      {/* Connection line (love) */}
      <path d="M47 45 Q60 35 73 45" stroke="#FF69B4" strokeWidth="2" fill="none" strokeDasharray="2,2" />
    </svg>
  )
}

export function DragonflySvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="50" rx="2" ry="30" fill="#32CD32" />

      {/* Head */}
      <circle cx="50" cy="25" r="4" fill="#228B22" />

      {/* Eyes */}
      <circle cx="47" cy="23" r="2" fill="#000" />
      <circle cx="53" cy="23" r="2" fill="#000" />

      {/* Upper wings */}
      <ellipse cx="35" cy="35" rx="15" ry="5" fill="#98FB98" opacity="0.7" />
      <ellipse cx="65" cy="35" rx="15" ry="5" fill="#98FB98" opacity="0.7" />

      {/* Lower wings */}
      <ellipse cx="35" cy="45" rx="12" ry="4" fill="#90EE90" opacity="0.7" />
      <ellipse cx="65" cy="45" rx="12" ry="4" fill="#90EE90" opacity="0.7" />

      {/* Wing veins */}
      <line x1="25" y1="35" x2="45" y2="35" stroke="#228B22" strokeWidth="0.5" />
      <line x1="55" y1="35" x2="75" y2="35" stroke="#228B22" strokeWidth="0.5" />
    </svg>
  )
}
