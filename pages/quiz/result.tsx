import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PART_TITLES } from '@/lib/chapters'
import { isExamPassed, PART_MAX_SCORE } from '@/lib/exam'

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

  const stars = totalScore >= 54 ? 3 : totalScore >= 36 ? 2 : 1
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

      {/* Part scores */}
      <div className="q-card space-y-4">
        <h2 className="font-semibold text-ink">과목별 점수</h2>
        {partScores.map((score, i) => {
          const partNum = i + 1
          const maxScore = PART_MAX_SCORE[partNum] ?? 8
          const threshold = maxScore * 0.4
          const ok = score >= threshold
          const pct = Math.min((score / maxScore) * 100, 100)
          return (
            <div key={partNum} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">{partNum}과목 {PART_TITLES[partNum]}</span>
                <span className={`font-bold ${ok ? 'text-mint-600' : 'text-red-500'}`}>
                  {score}점 / {maxScore}점 {ok ? '✓' : `✗ (기준 ${threshold}점)`}
                </span>
              </div>
              <div className="h-2 bg-surface-soft rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ok ? 'bg-mint-500' : 'bg-coral'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 실기 40점 안내 (FR-012) */}
      <div className="q-card bg-amber-50 border-amber-200 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-semibold text-amber-800">실기 40점 별도 준비 필요</h3>
        </div>
        <p className="text-sm text-amber-700">
          DAP 시험에서 실기 1문항은 전체 배점의 40점을 차지합니다.
          필기 만점(60점)이어도 실기 미달 시 불합격됩니다.
        </p>
        <Link
          href="/practical"
          className="inline-block mt-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          실기 연습 시작 →
        </Link>
      </div>

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
