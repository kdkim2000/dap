import React, { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CHAPTERS_BY_PART, PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

const PART_COLORS: Record<number, { bg: string; border: string; badge: string; bar: string }> = {
  1: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500' },
  2: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  3: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
  4: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  5: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', bar: 'bg-teal-500' },
  6: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
}

export default function QuizIndexPage() {
  const { stats, isHydrated } = useProgress()
  const router = useRouter()

  const getChapterRate = useCallback((chapterId: string) => {
    const c = stats.byChapter[chapterId]
    if (!c || c.attempted === 0) return null
    return Math.round((c.correct / c.attempted) * 100)
  }, [stats.byChapter])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">문제풀기</h1>
        <p className="text-ink-muted mt-1 text-sm">챕터별 학습 또는 모의고사로 실전 감각을 키우세요.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/quiz/exam')}
          aria-label="모의고사 시작"
          className="q-card flex items-center gap-3 hover:border-primary-300 hover:shadow-q-md transition-all cursor-pointer group"
        >
          <span className="text-3xl" role="img" aria-hidden="true">📝</span>
          <div className="text-left">
            <div className="font-bold text-ink group-hover:text-primary-600 transition-colors">모의고사</div>
            <div className="text-xs text-ink-muted">75문항 · 240분</div>
          </div>
        </button>

        <Link href="/quiz/wrong" aria-label="오답 노트 보기" className="q-card flex items-center gap-3 hover:border-red-200 hover:shadow-q-md transition-all group">
          <span className="text-3xl" role="img" aria-hidden="true">📕</span>
          <div>
            <div className="font-bold text-ink group-hover:text-red-600 transition-colors">오답 노트</div>
            <div className="text-xs text-ink-muted">
              {isHydrated
                ? `${Object.values(stats.byChapter ?? {}).reduce((s, c) => s + (c.attempted - c.correct), 0)}문항`
                : '로딩 중...'}
            </div>
          </div>
        </Link>

        <Link href="/quiz/bookmarks" aria-label="북마크 문제 보기" className="q-card flex items-center gap-3 hover:border-yellow-200 hover:shadow-q-md transition-all group">
          <span className="text-3xl" role="img" aria-hidden="true">⭐</span>
          <div>
            <div className="font-bold text-ink group-hover:text-yellow-600 transition-colors">북마크</div>
            <div className="text-xs text-ink-muted">저장한 문제</div>
          </div>
        </Link>
      </div>

      {/* Part sections */}
      {[1, 2, 3, 4, 5, 6].map(part => {
        const colors = PART_COLORS[part]
        const partChapters = CHAPTERS_BY_PART[part] ?? []
        const partStats = stats.byPart[part]
        const partRate = partStats && partStats.attempted > 0
          ? Math.round((partStats.correct / partStats.attempted) * 100)
          : null

        return (
          <div key={part}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                  {part}과목
                </span>
                <h2 className="text-base font-semibold text-ink">{PART_TITLES[part]}</h2>
              </div>
              {partRate !== null && (
                <span className="text-sm font-semibold text-ink-muted">
                  정답률 <strong className="text-ink">{partRate}%</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {partChapters.map(chapter => {
                const rate = isHydrated ? getChapterRate(chapter.id) : null
                const chStats = stats.byChapter[chapter.id]

                return (
                  <Link
                    key={chapter.id}
                    href={`/quiz/chapter/${chapter.id}`}
                    className={`q-card hover:shadow-q-md transition-all border ${colors.border} ${colors.bg} group`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs text-ink-faint mb-1">{part}과목 {chapter.chapter}장</div>
                        <div className="font-semibold text-ink text-sm group-hover:text-primary-700 transition-colors">
                          {chapter.title}
                        </div>
                      </div>
                      <span className="text-xl">📚</span>
                    </div>

                    {isHydrated && chStats && chStats.attempted > 0 ? (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-ink-muted mb-1">
                          <span>{chStats.attempted}문항 풀이</span>
                          <span className="font-semibold text-ink">{rate}%</span>
                        </div>
                        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bar} rounded-full transition-all`}
                            style={{ width: `${rate ?? 0}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-ink-faint">아직 풀지 않음</div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
