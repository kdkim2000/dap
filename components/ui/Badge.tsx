import React from 'react'

type BadgeType = 'streak' | 'gems' | 'hearts' | 'xp'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  type: BadgeType
  value: number
  size?: BadgeSize
}

const BADGE_CONFIG: Record<BadgeType, { icon: string; label: string; color: string }> = {
  streak: { icon: '🔥', label: '스트릭', color: 'text-orange-500' },
  gems:   { icon: '💎', label: '보석',   color: 'text-primary-500' },
  hearts: { icon: '❤️', label: '하트',   color: 'text-red-500' },
  xp:     { icon: '⚡', label: 'XP',     color: 'text-sun' },
}

export default function Badge({ type, value, size = 'md' }: BadgeProps) {
  const cfg = BADGE_CONFIG[type]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-surface font-semibold ${sizeClass} ${cfg.color} border border-current/20`}
      title={cfg.label}
    >
      <span>{cfg.icon}</span>
      <span>{value}</span>
    </span>
  )
}
