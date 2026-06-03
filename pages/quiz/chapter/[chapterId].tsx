import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { CHAPTER_IDS, getChapterById, getChapterFullLabel } from '@/lib/chapters'
import { getQuestionsByChapter } from '@/lib/questions'
import { useProgress } from '@/context/ProgressContext'
import QuestionCard from '@/components/quiz/QuestionCard'
import AnswerFeedback from '@/components/quiz/AnswerFeedback'
import QuizNavigator from '@/components/quiz/QuizNavigator'
import type { Question, AnswerResult } from '@/types'

interface Props {
  chapterId: string
  questions: Question[]
  chapterTitle: string
  part: number
  chapter: number
}

interface LocalAnswer {
  selectedIndex: number | null
  result: AnswerResult
}

export default function ChapterQuizPage({ chapterId, questions, chapterTitle, part, chapter }: Props) {
  const router = useRouter()
  const { markAnswer, toggleBookmark, isBookmarked, progress } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localAnswers, setLocalAnswers] = useState<Record<number, LocalAnswer>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = questions[currentIndex]

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback) return
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
      .map((q, i) => (progress.bookmarks.includes(q.id) ? i : -1))
      .filter(i => i >= 0)
  )

  // Finished summary
  if (isFinished || (questions.length > 0 && Object.keys(localAnswers).length === questions.length && !showFeedback && currentIndex === questions.length - 1)) {
    const correct = Object.values(localAnswers).filter(a => a.result === 'correct').length
    const total = questions.length
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="q-card text-center space-y-4">
          <div className="text-5xl">{rate >= 80 ? '🎉' : rate >= 60 ? '👍' : '💪'}</div>
          <h1 className="text-xl font-display font-bold text-ink">{chapterTitle} 완료!</h1>

          <div className="flex justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ink">{correct}</div>
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

          <div className="w-full bg-surface-soft rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${rate >= 60 ? 'bg-mint-500' : 'bg-coral'}`}
              style={{ width: `${rate}%` }}
            />
          </div>

          <div className="flex gap-3 justify-center pt-2">
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
            <Link
              href="/quiz/wrong"
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              오답 노트
            </Link>
            <Link
              href="/quiz"
              className="px-5 py-2.5 bg-surface-soft border border-[var(--q-border)] text-ink rounded-xl font-semibold text-sm hover:bg-surface-canvas transition-colors"
            >
              문제풀기 홈
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="q-card space-y-4">
          <div className="text-4xl">📭</div>
          <h2 className="text-lg font-bold text-ink">문제가 없습니다</h2>
          <p className="text-ink-muted text-sm">이 챕터의 문제가 아직 준비되지 않았습니다.</p>
          <Link href="/quiz" className="inline-block px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
            문제풀기 홈으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink-muted mb-4">
        <Link href="/quiz" className="hover:text-primary-600 transition-colors">문제풀기</Link>
        <span>›</span>
        <span className="text-ink font-medium">{part}과목 {chapter}장 {chapterTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
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
        </div>

        {/* Navigator */}
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: CHAPTER_IDS.map(id => ({ params: { chapterId: id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chapterId = params?.chapterId as string
  const questions = getQuestionsByChapter(chapterId)
  const meta = getChapterById(chapterId)

  return {
    props: {
      chapterId,
      questions,
      chapterTitle: meta?.title ?? chapterId,
      part: meta?.part ?? 1,
      chapter: meta?.chapter ?? 1,
    },
  }
}
