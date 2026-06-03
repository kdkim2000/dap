import React from 'react'
import { PART_TITLES } from '@/lib/chapters'
import { PART_MAX_SCORE } from '@/lib/exam'

interface Props {
  partScores: number[]  // index 0~5 = 과목 1~6 점수
}

export default function PartScoresDisplay({ partScores }: Props) {
  return (
    <div className="q-card space-y-4">
      <h2 className="font-semibold text-ink">과목별 점수</h2>
      {partScores.map((score, i) => {
        const partNum = i + 1
        const maxScore = PART_MAX_SCORE[partNum] ?? 8
        const threshold = Math.round(maxScore * 0.4 * 10) / 10
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
  )
}
