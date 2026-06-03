import React from 'react'
import { PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

const PART_COLORS: Record<number, { stroke: string; bg: string; text: string }> = {
  1: { stroke: '#6366F1', bg: 'bg-indigo-500', text: 'text-indigo-700' },
  2: { stroke: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-700' },
  3: { stroke: '#10B981', bg: 'bg-green-500', text: 'text-green-700' },
  4: { stroke: '#A855F7', bg: 'bg-purple-500', text: 'text-purple-700' },
  5: { stroke: '#14B8A6', bg: 'bg-teal-500', text: 'text-teal-700' },
  6: { stroke: '#F97316', bg: 'bg-orange-500', text: 'text-orange-700' },
}

interface CircleProgressProps {
  percent: number
  color: string
  size?: number
  strokeWidth?: number
}

function CircleProgress({ percent, color, size = 60, strokeWidth = 6 }: CircleProgressProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#E0E7FF"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="bold"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  )
}

export default function ProgressChart() {
  const { stats, isHydrated } = useProgress()

  return (
    <div className="q-card space-y-4">
      <h2 className="text-base font-semibold text-ink">과목별 정답률</h2>

      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map(part => {
          const colors = PART_COLORS[part]
          const partStats = stats.byPart[part]
          const rate = isHydrated && partStats && partStats.attempted > 0
            ? Math.round((partStats.correct / partStats.attempted) * 100)
            : 0

          return (
            <div key={part} className="flex flex-col items-center gap-2">
              <CircleProgress
                percent={rate}
                color={colors.stroke}
                size={56}
                strokeWidth={5}
              />
              <div className="text-center">
                <div className={`text-xs font-bold ${colors.text}`}>{part}과목</div>
                <div className="text-xs text-ink-faint leading-tight mt-0.5 hidden sm:block">
                  {PART_TITLES[part].split(' ')[0]}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall summary */}
      {isHydrated && stats.attempted > 0 && (
        <div className="pt-3 border-t border-[var(--q-border)] flex justify-between text-sm">
          <div className="text-ink-muted">전체 풀이</div>
          <div className="font-semibold text-ink">
            {stats.attempted}문항 / {stats.correct}정답 (
            <span className="text-primary-600">{Math.round((stats.correct / stats.attempted) * 100)}%</span>
            )
          </div>
        </div>
      )}
    </div>
  )
}
