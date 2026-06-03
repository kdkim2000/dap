import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { sampleExamQuestions, getMockExamQuestions } from '@/lib/questions'
import { useProgress } from '@/context/ProgressContext'
import {
  saveExamSession,
  loadExamSession,
  clearExamSession,
} from '@/lib/progress'
import QuestionCard from '@/components/quiz/QuestionCard'
import AnswerFeedback from '@/components/quiz/AnswerFeedback'
import QuizNavigator from '@/components/quiz/QuizNavigator'
import ExamTimer from '@/components/quiz/ExamTimer'
import type { Question, AnswerResult, ExamResult } from '@/types'
import { isExamPassed, PART_MAX_SCORE } from '@/lib/exam'
import PartScoresDisplay from '@/components/quiz/PartScoresDisplay'
import PracticalExamNotice from '@/components/quiz/PracticalExamNotice'

type ExamPhase = 'intro' | 'exam' | 'result'
type ExamMode = 'random' | 'exam1' | 'exam2'

interface LocalAnswer {
  selectedIndex: number
  result: AnswerResult
}

const PART_TITLES: Record<number, string> = {
  1: '전사아키텍처 이해',
  2: '데이터 요건 분석',
  3: '데이터 표준화',
  4: '데이터 모델링',
  5: '데이터베이스 설계와 이용',
  6: '데이터 품질 관리이해',
}

const MODE_CONFIG: Record<ExamMode, { label: string; desc: string; icon: string; btnLabel: string }> = {
  exam1:  { label: '모의고사 1회', desc: '고정 75문항 세트 1',   icon: '📋', btnLabel: '모의고사 1회 시작' },
  exam2:  { label: '모의고사 2회', desc: '고정 75문항 세트 2',   icon: '📄', btnLabel: '모의고사 2회 시작' },
  random: { label: '랜덤 출제',    desc: '매회 다른 문제 조합',  icon: '🎲', btnLabel: '랜덤 시험 시작' },
}

const EXAM_SECONDS = 14400 // 240분 (4시간, DAP 시험 기준)

export default function ExamPage() {
  const router = useRouter()
  const { saveExamResult, toggleBookmark, isBookmarked } = useProgress()

  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [examMode, setExamMode] = useState<ExamMode>('random')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localAnswers, setLocalAnswers] = useState<Record<number, LocalAnswer>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [timeUsed, setTimeUsed] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_SECONDS)
  const [hasSavedSession, setHasSavedSession] = useState(false)

  const examEndTimeRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)  // kept for elapsed-time calculation in result

  // ── 마운트 시 저장된 세션 확인 ────────────────────────────────────────
  useEffect(() => {
    const saved = loadExamSession()
    setHasSavedSession(saved !== null)
  }, [])

  // ── 답변·이동 시 세션 자동 저장 ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam' || questions.length === 0) return
    saveExamSession({
      mode: examMode,
      questions,
      currentIndex,
      answers: localAnswers,
      examEndTime: examEndTimeRef.current,
    })
  }, [localAnswers, currentIndex, phase, examMode, questions])

  // ── 새 시험 시작 ──────────────────────────────────────────────────────
  const startExam = () => {
    clearExamSession()
    const qs =
      examMode === 'exam1' ? getMockExamQuestions(1) :
      examMode === 'exam2' ? getMockExamQuestions(2) :
      sampleExamQuestions()

    const endTime = Date.now() + EXAM_SECONDS * 1000
    examEndTimeRef.current = endTime
    startTimeRef.current = Date.now()

    setQuestions(qs)
    setCurrentIndex(0)
    setLocalAnswers({})
    setShowFeedback(false)
    setSelectedOption(null)
    setRemainingSeconds(EXAM_SECONDS)
    setHasSavedSession(false)
    setPhase('exam')
  }

  // ── 이어서 풀기 (세션 복원) ───────────────────────────────────────────
  const resumeExam = () => {
    const saved = loadExamSession()
    if (!saved) return

    const remaining = Math.max(0, Math.floor((saved.examEndTime - Date.now()) / 1000))
    if (remaining === 0) {
      clearExamSession()
      setHasSavedSession(false)
      alert('이전 시험의 시간이 만료되었습니다. 새 시험을 시작해 주세요.')
      return
    }

    examEndTimeRef.current = saved.examEndTime
    startTimeRef.current = Date.now() - (EXAM_SECONDS - remaining) * 1000

    setExamMode(saved.mode)
    setQuestions(saved.questions)
    setCurrentIndex(saved.currentIndex)
    setLocalAnswers(saved.answers)
    setRemainingSeconds(remaining)
    setShowFeedback(false)
    setSelectedOption(saved.answers[saved.currentIndex]?.selectedIndex ?? null)
    setHasSavedSession(false)
    setPhase('exam')
  }

  // ── 시험 완료 ─────────────────────────────────────────────────────────
  const computeResult = useCallback((answers: Record<number, LocalAnswer>, qs: Question[], elapsed: number): ExamResult => {
    const partScores: Record<number, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
      5: { correct: 0, total: 0 },
      6: { correct: 0, total: 0 },
    }

    qs.forEach((q, i) => {
      const a = answers[i]
      partScores[q.part].total++
      if (a?.result === 'correct') partScores[q.part].correct++
    })

    const toScore = (part: number) => {
      const p = partScores[part]
      if (p.total === 0) return 0
      return Math.round((p.correct / p.total) * 100)
    }

    const totalCorrect = Object.values(partScores).reduce((s, p) => s + p.correct, 0)
    if (qs.length === 0) return { date: new Date().toISOString(), score: 0, part1Score: 0, part2Score: 0, part3Score: 0, part4Score: 0, part5Score: 0, part6Score: 0, totalTime: elapsed, answers: {} }
    const totalQ = qs.length
    const totalScore = Math.round((totalCorrect / totalQ) * 100)

    const answersMap: Record<string, number> = {}
    qs.forEach((q, i) => {
      if (answers[i] !== undefined) answersMap[q.id] = answers[i].selectedIndex
    })

    return {
      date: new Date().toISOString(),
      score: totalScore,
      part1Score: toScore(1),
      part2Score: toScore(2),
      part3Score: toScore(3),
      part4Score: toScore(4),
      part5Score: toScore(5),
      part6Score: toScore(6),
      totalTime: elapsed,
      answers: answersMap,
    }
  }, [])

  const finishExam = useCallback((answers: Record<number, LocalAnswer>) => {
    clearExamSession()
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    setTimeUsed(elapsed)
    const result = computeResult(answers, questions, elapsed)
    saveExamResult(result)
    setExamResult(result)
    setPhase('result')
  }, [questions, computeResult, saveExamResult])

  const handleTimeUp = useCallback(() => {
    finishExam(localAnswers)
  }, [finishExam, localAnswers])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback) return
    const currentQuestion = questions[currentIndex]
    setSelectedOption(optionIndex)
    const result: AnswerResult = optionIndex === currentQuestion.answer ? 'correct' : 'wrong'
    const newAnswers = { ...localAnswers, [currentIndex]: { selectedIndex: optionIndex, result } }
    setLocalAnswers(newAnswers)
    setShowFeedback(true)
  }, [showFeedback, questions, currentIndex, localAnswers])

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      finishExam(localAnswers)
      return
    }
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setShowFeedback(false)
    setSelectedOption(localAnswers[nextIndex]?.selectedIndex ?? null)
  }, [currentIndex, questions.length, localAnswers, finishExam])

  const handleNavigate = useCallback((index: number) => {
    setCurrentIndex(index)
    const prev = localAnswers[index]
    setSelectedOption(prev?.selectedIndex ?? null)
    setShowFeedback(prev !== undefined)
  }, [localAnswers])

  // ── 인트로 화면 ───────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="q-card space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl">📝</div>
            <h1 className="text-2xl font-display font-bold text-ink">DAsP 모의고사</h1>
            <p className="text-ink-muted text-sm">실전과 동일한 조건으로 실력을 확인해보세요.</p>
          </div>

          {/* 이어서 풀기 배너 */}
          {hasSavedSession && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-amber-800 text-sm">진행 중인 시험이 있습니다</div>
                <div className="text-xs text-amber-600 mt-0.5">이전 시험을 이어서 풀 수 있습니다</div>
              </div>
              <button
                onClick={resumeExam}
                className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                이어서 풀기
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="q-card bg-surface-soft text-center py-4">
              <div className="text-2xl font-bold text-primary-600">75</div>
              <div className="text-xs text-ink-muted mt-1">문항</div>
            </div>
            <div className="q-card bg-surface-soft text-center py-4">
              <div className="text-2xl font-bold text-primary-600">240</div>
              <div className="text-xs text-ink-muted mt-1">분</div>
            </div>
            <div className="q-card bg-surface-soft text-center py-4">
              <div className="text-2xl font-bold text-primary-600">6</div>
              <div className="text-xs text-ink-muted mt-1">과목</div>
            </div>
          </div>

          {/* Mode selection */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-ink">출제 방식 선택</div>
            <div className="space-y-2">
              {(['exam1', 'exam2', 'random'] as ExamMode[]).map(mode => {
                const cfg = MODE_CONFIG[mode]
                const selected = examMode === mode
                return (
                  <button
                    key={mode}
                    onClick={() => setExamMode(mode)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-[var(--q-border)] bg-surface hover:border-primary-300 hover:bg-surface-soft'
                    }`}
                  >
                    <span className="text-2xl">{cfg.icon}</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${selected ? 'text-primary-700' : 'text-ink'}`}>
                        {cfg.label}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5">{cfg.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      selected ? 'border-primary-500 bg-primary-500' : 'border-ink-faint'
                    }`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pass criteria */}
          <div className="text-left bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 text-sm space-y-1">
            <div className="font-semibold text-primary-800 mb-2">합격 기준 (필기)</div>
            <div className="text-primary-700">• 필기 전체 36점 이상 (60점 만점)</div>
            <div className="text-primary-700">• 각 과목별 배점의 40% 이상</div>
            <div className="text-primary-700">• 1·2·3·5·6과목 각 10문항, 4과목 25문항</div>
          </div>
          <PracticalExamNotice variant="compact" />

          <button
            onClick={startExam}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-base transition-colors shadow-q-md"
          >
            {MODE_CONFIG[examMode].btnLabel}
          </button>
        </div>
      </div>
    )
  }

  // ── 결과 화면 ─────────────────────────────────────────────────────────
  if (phase === 'result' && examResult) {
    const scoresByPart: Record<number, number> = {
      1: examResult.part1Score, 2: examResult.part2Score, 3: examResult.part3Score,
      4: examResult.part4Score, 5: examResult.part5Score, 6: examResult.part6Score,
    }
    const passed = isExamPassed(scoresByPart)

    const partScores = [
      examResult.part1Score,
      examResult.part2Score,
      examResult.part3Score,
      examResult.part4Score,
      examResult.part5Score,
      examResult.part6Score,
    ]

    const stars = examResult.score >= 80 ? 3 : examResult.score >= 60 ? 2 : 1
    const mins = Math.floor(timeUsed / 60)
    const secs = timeUsed % 60

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="q-card text-center space-y-4">
          <div className="text-5xl">{passed ? '🎉' : '😔'}</div>
          <h1 className="text-xl font-display font-bold text-ink">
            {passed ? '합격!' : '불합격'}
          </h1>
          <div className="flex justify-center gap-1 text-3xl">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>{i < stars ? '★' : '☆'}</span>
            ))}
          </div>
          <div className="text-5xl font-display font-bold text-primary-600">
            {examResult.score}점
          </div>
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
            passed ? 'bg-mint-50 text-mint-700 border border-mint-300' : 'bg-red-50 text-red-700 border border-red-300'
          }`}>
            {passed ? '합격' : '불합격'} (기준: 60점 이상 + 각 과목 40점 이상)
          </div>
          <div className="text-xs text-ink-muted">소요 시간: {mins}분 {secs}초</div>
        </div>

        <PartScoresDisplay partScores={partScores} />

        <div className="flex gap-3">
          <button
            onClick={() => {
              setPhase('intro')
              setExamResult(null)
              setLocalAnswers({})
            }}
            className="flex-1 py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
          >
            다시 도전
          </button>
          <Link href="/quiz/wrong" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors text-center">
            오답 노트
          </Link>
        </div>
      </div>
    )
  }

  // ── 시험 화면 ─────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex]
  const navigatorAnswers: Record<number, AnswerResult | null> = Object.fromEntries(
    Object.entries(localAnswers).map(([k, v]) => [Number(k), v.result])
  )
  const bookmarkIndices = new Set(
    questions
      .map((q, i) => (isBookmarked(q.id) ? i : -1))
      .filter(i => i >= 0)
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-ink">DAsP 모의고사</h1>
          <p className="text-xs text-ink-muted">
            {currentIndex + 1} / {questions.length}문항 · {currentQuestion?.part}과목
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExamTimer totalSeconds={remainingSeconds} onTimeUp={handleTimeUp} />
          <button
            onClick={() => finishExam(localAnswers)}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            제출하기
          </button>
        </div>
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
