export function PushPinSvg({ className = "w-8 h-8", color = "#FF69B4" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pin body */}
      <ellipse cx="50" cy="35" rx="20" ry="25" fill={color} stroke="#FFF" strokeWidth="2" />
      <ellipse cx="50" cy="35" rx="15" ry="20" fill="#FFF" opacity="0.3" />

      {/* Pin point */}
      <path d="M40 55 L50 75 L60 55 Z" fill={color} stroke="#FFF" strokeWidth="1" />

      {/* Pin head/button */}
      <circle cx="50" cy="20" r="8" fill={color} stroke="#FFF" strokeWidth="2" />
      <circle cx="50" cy="20" r="4" fill="#FFF" opacity="0.8" />

      {/* Shine effect */}
      <circle cx="47" cy="17" r="2" fill="#FFF" opacity="0.9" />
      <ellipse cx="45" cy="30" rx="3" ry="5" fill="#FFF" opacity="0.4" />

      {/* Shadow */}
      <ellipse cx="52" cy="75" rx="6" ry="2" fill="#000" opacity="0.2" />
    </svg>
  )
}
