import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useProgress } from '@/context/ProgressContext'
import { getQuestionsByIds } from '@/lib/questions'
import QuestionCard from '@/components/quiz/QuestionCard'
import AnswerFeedback from '@/components/quiz/AnswerFeedback'
import QuizNavigator from '@/components/quiz/QuizNavigator'
import type { Question, AnswerResult } from '@/types'

interface LocalAnswer {
  selectedIndex: number
  result: AnswerResult
}

export default function WrongPage() {
  const { progress, markAnswer, toggleBookmark, isBookmarked, isHydrated } = useProgress()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localAnswers, setLocalAnswers] = useState<Record<number, LocalAnswer>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (!isHydrated) return
    const wrongIds = Object.entries(progress.answers)
      .filter(([, result]) => result === 'wrong')
      .map(([id]) => id)
    const qs = getQuestionsByIds(wrongIds)
    setQuestions(qs)
    setCurrentIndex(0)
    setLocalAnswers({})
    setShowFeedback(false)
    setSelectedOption(null)
    setIsFinished(false)
  }, [isHydrated, progress.answers])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback || !currentQuestion) return
    setSelectedOption(optionIndex)
    const result: AnswerResult = optionIndex === currentQuestion.answer ? 'correct' : 'wrong'
    markAnswer(currentQuestion.id, result)
    setLocalAnswers(prev => ({
      ...prev,
      [currentIndex]: { selectedIndex: optionIndex, result },
    }))
    setShowFeedback(true)
  }, [showFeedback, currentQuestion, currentIndex, markAnswer])

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setIsFinished(true)
      return
    }
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setShowFeedback(false)
    setSelectedOption(localAnswers[nextIndex]?.selectedIndex ?? null)
  }, [currentIndex, questions.length, localAnswers])

  const handleNavigate = useCallback((index: number) => {
    setCurrentIndex(index)
    const prev = localAnswers[index]
    setSelectedOption(prev?.selectedIndex ?? null)
    setShowFeedback(prev !== undefined)
  }, [localAnswers])

  const navigatorAnswers: Record<number, AnswerResult | null> = Object.fromEntries(
    Object.entries(localAnswers).map(([k, v]) => [Number(k), v.result])
  )

  const bookmarkIndices = new Set(
    questions
      .map((q, i) => (isBookmarked(q.id) ? i : -1))
      .filter(i => i >= 0)
  )

  if (!isHydrated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-ink-faint text-sm">로딩 중...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h1 className="text-xl font-bold text-ink">오답이 없습니다!</h1>
        <p className="text-ink-muted text-sm">아직 풀지 않았거나 모든 문제를 맞혔습니다.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/quiz" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
            문제 풀러 가기
          </Link>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const correct = Object.values(localAnswers).filter(a => a.result === 'correct').length
    const total = questions.length
    const rate = Math.round((correct / total) * 100)

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="q-card text-center space-y-4">
          <div className="text-5xl">{rate >= 80 ? '🏆' : rate >= 60 ? '👍' : '💪'}</div>
          <h1 className="text-xl font-bold text-ink">오답 노트 완료!</h1>
          <div className="flex justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-mint-600">{correct}</div>
              <div className="text-xs text-ink-muted mt-1">정답</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{total - correct}</div>
              <div className="text-xs text-ink-muted mt-1">오답</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{rate}%</div>
              <div className="text-xs text-ink-muted mt-1">정답률</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0)
                setLocalAnswers({})
                setShowFeedback(false)
                setSelectedOption(null)
                setIsFinished(false)
              }}
              className="px-5 py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
            >
              다시 풀기
            </button>
            <Link href="/quiz" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              문제풀기 홈
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-ink-muted mb-4">
        <Link href="/quiz" className="hover:text-primary-600 transition-colors">문제풀기</Link>
        <span>›</span>
        <span className="text-ink font-medium">오답 노트</span>
        <span className="ml-auto text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
          {questions.length}문항
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {currentQuestion && (
            <>
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedOption={selectedOption}
                showResult={showFeedback}
                onAnswer={handleAnswer}
                isBookmarked={isBookmarked(currentQuestion.id)}
                onToggleBookmark={() => toggleBookmark(currentQuestion.id)}
              />
              {showFeedback && (
                <AnswerFeedback
                  question={currentQuestion}
                  selectedIndex={selectedOption}
                  onNext={handleNext}
                  isLast={currentIndex === questions.length - 1}
                />
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <QuizNavigator
              total={questions.length}
              current={currentIndex}
              answers={navigatorAnswers}
              onNavigate={handleNavigate}
              bookmarks={bookmarkIndices}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
