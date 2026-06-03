import React from 'react'
import Link from 'next/link'
import { CHAPTERS_BY_PART, PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

const PART_COLORS: Record<number, { bg: string; border: string; badge: string; bar: string; icon: string }> = {
  1: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: '🏛️' },
  2: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500', icon: '📋' },
  3: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500', icon: '📐' },
  4: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500', icon: '🗂️' },
  5: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', bar: 'bg-teal-500', icon: '🗄️' },
  6: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500', icon: '✅' },
}

export default function TheoryIndexPage() {
  const { stats, isHydrated } = useProgress()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">이론 학습</h1>
        <p className="text-ink-muted mt-1 text-sm">
          DAP 시험 6과목의 핵심 이론을 단계별로 학습하세요.
        </p>
      </div>

      {/* Part sections */}
      {[1, 2, 3, 4, 5, 6].map(part => {
        const colors = PART_COLORS[part]
        const chapters = CHAPTERS_BY_PART[part] ?? []
        const partStats = stats.byPart[part]
        const partRate = partStats && partStats.attempted > 0
          ? Math.round((partStats.correct / partStats.attempted) * 100)
          : null

        return (
          <section key={part}>
            {/* Part header */}
            <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${colors.bg} border ${colors.border}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{colors.icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {part}과목
                  </span>
                  <h2 className="text-lg font-bold text-ink mt-1">{PART_TITLES[part]}</h2>
                </div>
              </div>
              {isHydrated && partRate !== null && (
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">{partRate}%</div>
                  <div className="text-xs text-ink-muted">문제 정답률</div>
                </div>
              )}
            </div>

            {/* Chapter cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {chapters.map(ch => {
                const chStats = stats.byChapter[ch.id]
                const chRate = chStats && chStats.attempted > 0
                  ? Math.round((chStats.correct / chStats.attempted) * 100)
                  : null

                return (
                  <Link
                    key={ch.id}
                    href={`/theory/${ch.id}`}
                    className="q-card hover:shadow-q-md transition-all group hover:border-primary-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs text-ink-faint mb-1">
                          {part}과목 {ch.chapter}장
                        </div>
                        <div className="font-semibold text-ink text-sm group-hover:text-primary-700 transition-colors leading-snug">
                          {ch.title}
                        </div>
                      </div>
                      <span className="text-xl shrink-0">📖</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {isHydrated && chRate !== null ? (
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-ink-muted mb-1">
                            <span>문제 정답률</span>
                            <span className="font-semibold text-ink">{chRate}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-soft rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bar} rounded-full`}
                              style={{ width: `${chRate}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-faint">이론 보기 →</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
