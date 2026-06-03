import React from 'react'
import type { AnswerResult } from '@/types'

interface QuizNavigatorProps {
  total: number
  current: number
  answers: Record<number, AnswerResult | null>
  onNavigate: (index: number) => void
  bookmarks?: Set<number>
}

export default function QuizNavigator({
  total,
  current,
  answers,
  onNavigate,
  bookmarks = new Set(),
}: QuizNavigatorProps) {
  const getStyle = (index: number) => {
    const isCurrent = index === current
    const result = answers[index]
    const isBookmarked = bookmarks.has(index)

    let base =
      'relative w-full aspect-square text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer '

    if (isCurrent) {
      base += 'ring-2 ring-primary-500 ring-offset-1 '
    }

    if (isBookmarked && !isCurrent) {
      base += 'ring-2 ring-yellow-400 ring-offset-1 '
    }

    if (result === 'correct') {
      base += 'bg-mint-500 text-white'
    } else if (result === 'wrong') {
      base += 'bg-coral text-white'
    } else if (result === 'skipped') {
      base += 'bg-ink-faint text-white'
    } else {
      // unattempted
      base += isCurrent
        ? 'bg-primary-100 text-primary-700'
        : 'bg-surface-soft text-ink-muted hover:bg-primary-50 hover:text-primary-600'
    }

    return base
  }

  return (
    <div className="q-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">문제 목록</h3>
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-mint-500"></span>정답
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-coral"></span>오답
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-surface-soft border border-[var(--q-border)]"></span>미풀이
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={getStyle(i)}
            title={`${i + 1}번 문제`}
            aria-label={`${i + 1}번 문제로 이동`}
          >
            {i + 1}
            {bookmarks.has(i) && (
              <span className="absolute -top-1 -right-1 text-yellow-400 text-xs leading-none">★</span>
            )}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-ink-muted pt-1 border-t border-[var(--q-border)]">
        <span>
          풀이: <strong className="text-ink">{Object.keys(answers).length}</strong> / {total}
        </span>
        <span>
          정답: <strong className="text-mint-600">
            {Object.values(answers).filter(v => v === 'correct').length}
          </strong>
        </span>
        <span>
          오답: <strong className="text-red-500">
            {Object.values(answers).filter(v => v === 'wrong').length}
          </strong>
        </span>
      </div>
    </div>
  )
}
