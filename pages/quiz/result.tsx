import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isExamPassed } from '@/lib/exam'
import PartScoresDisplay from '@/components/quiz/PartScoresDisplay'
import PracticalExamNotice from '@/components/quiz/PracticalExamNotice'

export default function ResultPage() {
  const router = useRouter()
  const {
    score,
    p1, p2, p3, p4, p5, p6,
    time,
    total,
    correct,
  } = router.query

  const totalScore = Number(score ?? 0)
  const partScores = [
    Number(p1 ?? 0),
    Number(p2 ?? 0),
    Number(p3 ?? 0),
    Number(p4 ?? 0),
    Number(p5 ?? 0),
    Number(p6 ?? 0),
  ]
  const timeSeconds = Number(time ?? 0)
  const totalQ = Number(total ?? 0)
  const correctQ = Number(correct ?? 0)

  const scoresByPart: Record<number, number> = Object.fromEntries(
    partScores.map((s, i) => [i + 1, s])
  )
  const passed = isExamPassed(scoresByPart)

  const stars = totalScore >= 48 ? 3 : totalScore >= 36 ? 2 : 1  // 60점 만점 기준: 80%=3성, 60%=2성(합격선)
  const mins = Math.floor(timeSeconds / 60)
  const secs = timeSeconds % 60

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Summary */}
      <div className="q-card text-center space-y-4">
        <div className="text-5xl">{passed ? '🎉' : '💪'}</div>
        <h1 className="text-xl font-display font-bold text-ink">시험 결과</h1>

        <div className="flex justify-center gap-1 text-3xl">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={i < stars ? 'text-yellow-400' : 'text-ink-faint'}>
              {i < stars ? '★' : '☆'}
            </span>
          ))}
        </div>

        <div className="text-5xl font-display font-bold text-primary-600">{totalScore}점</div>

        {totalQ > 0 && (
          <div className="text-sm text-ink-muted">
            {correctQ} / {totalQ} 정답
          </div>
        )}

        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${
          passed
            ? 'bg-mint-50 text-mint-700 border-mint-300'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {passed ? '합격' : '불합격'} — 기준: 전체 36점↑ + 각 과목 배점 40%↑
        </div>

        {timeSeconds > 0 && (
          <div className="text-xs text-ink-faint">소요 시간: {mins}분 {secs}초</div>
        )}
      </div>

      <PartScoresDisplay partScores={partScores} />

      <PracticalExamNotice variant="extended" showLink />

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/quiz/exam"
          className="flex-1 py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors text-center"
        >
          다시 도전
        </Link>
        <Link
          href="/quiz/wrong"
          className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors text-center"
        >
          오답 노트
        </Link>
        <Link
          href="/"
          className="flex-1 py-2.5 bg-surface-soft border border-[var(--q-border)] text-ink rounded-xl font-semibold text-sm hover:bg-surface-canvas transition-colors text-center"
        >
          홈으로
        </Link>
      </div>
    </div>
  )
}
