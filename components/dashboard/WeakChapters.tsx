import React from 'react'
import Link from 'next/link'
import { CHAPTERS, PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

export default function WeakChapters() {
  const { stats, isHydrated } = useProgress()

  const weakChapters = isHydrated
    ? CHAPTERS
        .map(ch => {
          const s = stats.byChapter[ch.id]
          if (!s || s.attempted === 0) return null
          const rate = Math.round((s.correct / s.attempted) * 100)
          return { ch, rate, attempted: s.attempted }
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => a.rate - b.rate)
        .slice(0, 3)
    : []

  return (
    <div className="q-card space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-ink">취약 챕터</h2>
        <span className="text-sm text-ink-faint">정답률 낮은 순</span>
      </div>

      {weakChapters.length === 0 ? (
        <div className="text-center py-6 text-ink-faint text-sm">
          <div className="text-3xl mb-2">📊</div>
          <div>문제를 풀면 취약 챕터가 표시됩니다.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {weakChapters.map(({ ch, rate, attempted }, idx) => (
            <Link
              key={ch.id}
              href={`/quiz/chapter/${ch.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--q-border)] hover:border-red-200 hover:bg-red-50/50 transition-all group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-400' : 'bg-yellow-400'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-ink-faint mb-0.5">{ch.part}과목 {ch.chapter}장</div>
                <div className="text-sm font-semibold text-ink group-hover:text-red-700 transition-colors truncate">
                  {ch.title}
                </div>
                <div className="h-1.5 bg-surface-soft rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full ${rate < 40 ? 'bg-red-400' : rate < 60 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-lg font-bold ${rate < 40 ? 'text-red-500' : rate < 60 ? 'text-orange-500' : 'text-yellow-600'}`}>
                  {rate}%
                </div>
                <div className="text-xs text-ink-faint">{attempted}문항</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {weakChapters.length > 0 && (
        <Link
          href="/quiz/wrong"
          className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          오답 노트로 복습하기 →
        </Link>
      )}
    </div>
  )
}
