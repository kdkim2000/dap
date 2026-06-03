import React from 'react'
import Link from 'next/link'
import { CHAPTERS, PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

const PART_COLORS: Record<number, { bar: string; badge: string; text: string }> = {
  1: { bar: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700' },
  2: { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  3: { bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', text: 'text-green-700' },
  4: { bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', text: 'text-purple-700' },
  5: { bar: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700', text: 'text-teal-700' },
  6: { bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', text: 'text-orange-700' },
}

export default function ChapterProgress() {
  const { stats, isHydrated } = useProgress()

  return (
    <div className="q-card space-y-4">
      <h2 className="text-base font-semibold text-ink">챕터별 진도</h2>

      <div className="space-y-3">
        {CHAPTERS.map(ch => {
          const colors = PART_COLORS[ch.part]
          const chStats = stats.byChapter[ch.id]
          const attempted = chStats?.attempted ?? 0
          const correct = chStats?.correct ?? 0
          const rate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

          return (
            <Link
              key={ch.id}
              href={`/quiz/chapter/${ch.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                    {ch.part}-{ch.chapter}
                  </span>
                  <span className="text-sm text-ink group-hover:text-primary-700 transition-colors font-medium truncate max-w-[160px]">
                    {ch.title}
                  </span>
                </div>
                <span className={`text-sm font-bold ${isHydrated && attempted > 0 ? colors.text : 'text-ink-faint'}`}>
                  {isHydrated && attempted > 0 ? `${rate}%` : '-'}
                </span>
              </div>
              <div className="h-2 bg-surface-soft rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                  style={{ width: isHydrated ? `${rate}%` : '0%' }}
                />
              </div>
              {isHydrated && attempted > 0 && (
                <div className="text-xs text-ink-faint mt-0.5">{attempted}문항 풀이</div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
