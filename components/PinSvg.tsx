export function PinSvg({ className = "w-8 h-8", color = "#FF69B4" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pin head */}
      <circle cx="50" cy="25" r="15" fill={color} stroke="#FFF" strokeWidth="2" />
      <circle cx="50" cy="25" r="8" fill="#FFF" />

      {/* Pin needle */}
      <rect x="48" y="40" width="4" height="45" fill={color} />
      <path d="M46 85 L50 95 L54 85 Z" fill={color} />

      {/* Shine effect */}
      <circle cx="45" cy="20" r="3" fill="#FFF" opacity="0.7" />

      {/* Shadow */}
      <ellipse cx="52" cy="90" rx="8" ry="3" fill="#000" opacity="0.2" />
    </svg>
  )
}
