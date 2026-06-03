import React from 'react'
import Link from 'next/link'
import { CHAPTERS, CHAPTERS_BY_PART, PART_TITLES } from '@/lib/chapters'
import { useProgress } from '@/context/ProgressContext'

const PART_COLORS: Record<number, { bubble: string; text: string; boss: string }> = {
  1: { bubble: 'bg-indigo-500', text: 'text-indigo-700', boss: 'bg-indigo-700' },
  2: { bubble: 'bg-blue-500', text: 'text-blue-700', boss: 'bg-blue-700' },
  3: { bubble: 'bg-green-500', text: 'text-green-700', boss: 'bg-green-700' },
  4: { bubble: 'bg-purple-500', text: 'text-purple-700', boss: 'bg-purple-700' },
  5: { bubble: 'bg-teal-500', text: 'text-teal-700', boss: 'bg-teal-700' },
  6: { bubble: 'bg-orange-500', text: 'text-orange-700', boss: 'bg-orange-700' },
}

function getFirstIncompleteChapter(chapterIds: string[], answers: Record<string, string>): string | null {
  for (const id of chapterIds) {
    // A chapter is "completed" if it has at least some answers
    // (simplified check — in real app would compare against question counts)
    const chapter = CHAPTERS.find(c => c.id === id)
    const prefix = chapter?.idPrefix ?? ''
    const hasAttempted = prefix ? Object.keys(answers).some(qid => qid.startsWith(prefix)) : false
    if (!hasAttempted) return id
  }
  return null
}

export default function LearningPath() {
  const { stats, progress, isHydrated } = useProgress()

  const getChapterStatus = (chapterId: string): 'done' | 'current' | 'locked' => {
    if (!isHydrated) return 'locked'
    const chStats = stats.byChapter[chapterId]
    if (!chStats) return 'locked'
    if (chStats.attempted >= 3 && chStats.correct / Math.max(chStats.attempted, 1) >= 0.6) return 'done'

    // Find the first non-done chapter as current
    const allChapters = CHAPTERS.map(c => c.id)
    const firstIncomplete = getFirstIncompleteChapter(allChapters, progress.answers)
    if (firstIncomplete === chapterId) return 'current'

    return chStats.attempted > 0 ? 'current' : 'locked'
  }

  return (
    <div className="q-card space-y-6">
      <h2 className="text-base font-semibold text-ink">학습 경로</h2>

      <div className="space-y-6 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6].map(part => {
          const colors = PART_COLORS[part]
          const chapters = CHAPTERS_BY_PART[part] ?? []

          return (
            <div key={part} className="space-y-2">
              {/* Part label */}
              <div className={`text-xs font-bold ${colors.text}`}>
                {part}과목 {PART_TITLES[part]}
              </div>

              {/* Bubbles row */}
              <div className="flex items-center gap-2 flex-wrap">
                {chapters.map((ch, idx) => {
                  const status = getChapterStatus(ch.id)

                  if (status === 'done') {
                    return (
                      <Link
                        key={ch.id}
                        href={`/quiz/chapter/${ch.id}`}
                        className={`relative flex flex-col items-center gap-1 group`}
                        title={ch.title}
                      >
                        <div className={`w-12 h-12 rounded-full ${colors.bubble} flex items-center justify-center text-white font-bold text-sm shadow-q-sm`}>
                          ✓
                        </div>
                        <span className="text-xs text-ink-faint text-center w-14 leading-tight hidden sm:block">{ch.chapter}장</span>
                        {idx < chapters.length - 1 && (
                          <span className="absolute left-12 top-5 w-6 h-0.5 bg-green-300" />
                        )}
                      </Link>
                    )
                  }

                  if (status === 'current') {
                    return (
                      <Link
                        key={ch.id}
                        href={`/quiz/chapter/${ch.id}`}
                        className="relative flex flex-col items-center gap-1 group"
                        title={ch.title}
                      >
                        <div className={`w-12 h-12 rounded-full ${colors.bubble} flex items-center justify-center text-white font-bold text-sm shadow-q-md ring-4 ring-primary-200 animate-q-bounce`}>
                          ▶
                        </div>
                        <span className="text-xs text-primary-600 font-semibold text-center w-14 leading-tight hidden sm:block">{ch.chapter}장</span>
                      </Link>
                    )
                  }

                  // locked
                  return (
                    <div
                      key={ch.id}
                      className="relative flex flex-col items-center gap-1"
                      title={`${ch.title} (잠김)`}
                    >
                      <div className="w-12 h-12 rounded-full bg-surface-soft border-2 border-[var(--q-border)] flex items-center justify-center text-ink-faint text-lg shadow-q-xs">
                        🔒
                      </div>
                      <span className="text-xs text-ink-faint text-center w-14 leading-tight hidden sm:block">{ch.chapter}장</span>
                    </div>
                  )
                })}

                {/* BOSS bubble at end of each part */}
                <div className="flex flex-col items-center gap-1" title={`${part}과목 보스전`}>
                  <div className={`w-14 h-14 rounded-full ${colors.boss} flex items-center justify-center text-white text-xl shadow-q-md`}>
                    👑
                  </div>
                  <span className="text-xs text-ink-faint text-center w-16 leading-tight hidden sm:block">BOSS</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
