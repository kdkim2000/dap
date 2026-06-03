import React from 'react'

type Expression = 'happy' | 'excited' | 'thinking'

interface MascotProps {
  expression?: Expression
  size?: number
  className?: string
}

export default function Mascot({ expression = 'happy', size = 64, className = '' }: MascotProps) {
  const eyeY = expression === 'thinking' ? 28 : 26
  const mouthPath =
    expression === 'excited'
      ? 'M 20 38 Q 28 46 36 38'
      : expression === 'thinking'
      ? 'M 22 38 Q 28 36 34 38'
      : 'M 21 37 Q 28 44 35 37'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* body */}
      <circle cx="28" cy="28" r="26" fill="#6366F1" />
      {/* face */}
      <circle cx="28" cy="28" r="20" fill="#EEF2FF" />
      {/* eyes */}
      <circle cx="21" cy={eyeY} r="3" fill="#312E81" />
      <circle cx="35" cy={eyeY} r="3" fill="#312E81" />
      {/* eye shine */}
      <circle cx="22.5" cy={eyeY - 1} r="1" fill="white" />
      <circle cx="36.5" cy={eyeY - 1} r="1" fill="white" />
      {/* mouth */}
      <path d={mouthPath} stroke="#312E81" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* graduation cap */}
      <rect x="14" y="10" width="28" height="4" rx="1" fill="#312E81" />
      <polygon points="28,6 40,10 28,14 16,10" fill="#4338CA" />
      <line x1="40" y1="10" x2="42" y2="16" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="42" cy="17" r="1.5" fill="#FBBF24" />
    </svg>
  )
}
