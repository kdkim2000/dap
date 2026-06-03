import React, { useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedOption: number | null
  showResult: boolean
  onAnswer: (index: number) => void
  isBookmarked: boolean
  onToggleBookmark: () => void
}

const DIFFICULTY_COLOR: Record<string, string> = {
  '하': 'bg-mint-50 text-mint-600 border-mint-200',
  '중': 'bg-sun-light text-amber-700 border-amber-200',
  '상': 'bg-red-50 text-red-600 border-red-200',
}

const PART_COLOR: Record<number, string> = {
  1: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  2: 'bg-blue-50 text-blue-700 border-blue-200',
  3: 'bg-green-50 text-green-700 border-green-200',
  4: 'bg-purple-50 text-purple-700 border-purple-200',
  5: 'bg-teal-50 text-teal-700 border-teal-200',
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  showResult,
  onAnswer,
  isBookmarked,
  onToggleBookmark,
}: QuestionCardProps) {
  const getOptionStyle = useCallback((index: number) => {
    const base =
      'w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium flex items-start gap-3'

    if (!showResult) {
      if (selectedOption === index) {
        return `${base} border-primary-500 bg-primary-50 text-primary-800`
      }
      return `${base} border-[var(--q-border)] bg-surface hover:border-primary-300 hover:bg-primary-50/50 text-ink`
    }

    // showResult mode
    if (index === question.answer) {
      return `${base} border-mint-500 bg-mint-50 text-mint-800`
    }
    if (selectedOption === index && index !== question.answer) {
      return `${base} border-coral bg-red-50 text-red-800`
    }
    return `${base} border-[var(--q-border)] bg-surface text-ink-muted`
  }, [showResult, selectedOption, question.answer])

  const getOptionIcon = useCallback((index: number) => {
    const labels = ['①', '②', '③', '④']
    if (!showResult) return labels[index]
    if (index === question.answer) return '✓'
    if (selectedOption === index && index !== question.answer) return '✗'
    return labels[index]
  }, [showResult, selectedOption, question.answer])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showResult) return
      const num = parseInt(e.key)
      if (num >= 1 && num <= 4) {
        onAnswer(num - 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showResult, onAnswer])

  return (
    <div className="q-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-ink-muted bg-surface-soft px-2 py-1 rounded-full border border-[var(--q-border)]">
            {questionNumber} / {totalQuestions}
          </span>
          {question.difficulty && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${DIFFICULTY_COLOR[question.difficulty]}`}>
              {question.difficulty}
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${PART_COLOR[question.part]}`}>
            {question.part}과목
          </span>
          {question.tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-surface-soft text-ink-muted border border-[var(--q-border)]">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={onToggleBookmark}
          className={`p-2 rounded-lg transition-colors text-lg ${
            isBookmarked ? 'text-yellow-400 hover:text-yellow-500' : 'text-ink-faint hover:text-yellow-400'
          }`}
          aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
          title={isBookmarked ? '북마크 해제' : '북마크 추가'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      {/* Question content */}
      <div className="prose-dasp prose max-w-none text-ink text-base leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {question.content}
        </ReactMarkdown>
      </div>

      {/* Options */}
      <div className="space-y-2 mt-2">
        {question.options.map((option, index) => (
          <button
            key={`opt-${index}`}
            onClick={() => !showResult && onAnswer(index)}
            disabled={showResult}
            className={getOptionStyle(index)}
          >
            <span className="shrink-0 w-6 text-center font-bold">{getOptionIcon(index)}</span>
            <span className="flex-1">{option}</span>
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      {!showResult && (
        <p className="text-xs text-ink-faint text-right mt-1">
          키보드 숫자키 1~4로 선택 가능
        </p>
      )}
    </div>
  )
}
