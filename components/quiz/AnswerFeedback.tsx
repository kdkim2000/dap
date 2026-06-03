import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Question } from '@/types'

interface AnswerFeedbackProps {
  question: Question
  selectedIndex: number | null
  onNext: () => void
  isLast: boolean
}

export default function AnswerFeedback({
  question,
  selectedIndex,
  onNext,
  isLast,
}: AnswerFeedbackProps) {
  const isCorrect = selectedIndex === question.answer
  const isSkipped = selectedIndex === null

  return (
    <div className={`q-card space-y-4 border-l-4 ${
      isSkipped
        ? 'border-l-ink-faint'
        : isCorrect
        ? 'border-l-mint-500'
        : 'border-l-coral'
    }`}>
      {/* Result header */}
      <div className={`flex items-center gap-2 text-lg font-bold ${
        isSkipped ? 'text-ink-muted' : isCorrect ? 'text-mint-600' : 'text-red-600'
      }`}>
        <span className="text-2xl">
          {isSkipped ? '—' : isCorrect ? '✓' : '✗'}
        </span>
        <span>
          {isSkipped ? '건너뜀' : isCorrect ? '정답입니다!' : '오답입니다'}
        </span>
      </div>

      {/* Correct answer info when wrong */}
      {!isCorrect && !isSkipped && (
        <div className="bg-mint-50 border border-mint-200 rounded-xl px-4 py-3 text-sm">
          <span className="font-semibold text-mint-700">정답: </span>
          <span className="text-mint-800">
            {question.answer + 1}번 — {question.options[question.answer]}
          </span>
        </div>
      )}

      {/* Explanation */}
      <div>
        <h4 className="text-sm font-semibold text-ink-muted mb-2">해설</h4>
        <div className="prose-dasp prose max-w-none text-sm text-ink leading-relaxed bg-surface-soft rounded-xl px-4 py-3 border border-[var(--q-border)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {question.explanation}
          </ReactMarkdown>
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-q-sm"
        >
          {isLast ? '결과 보기' : '다음 문제 →'}
        </button>
      </div>
    </div>
  )
}
