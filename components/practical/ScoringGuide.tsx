import React, { useState } from 'react'

interface Props {
  checkPoints: string[]
  sampleAnswer: string
}

export default function ScoringGuide({ checkPoints, sampleAnswer }: Props) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(() => new Array(checkPoints.length).fill(false))
  const [showAnswer, setShowAnswer] = useState(false)

  const toggle = (i: number) => {
    setChecked(prev => { const next = [...prev]; next[i] = !next[i]; return next })
  }

  const checkedCount = checked.filter(Boolean).length

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border-2 border-dashed border-primary-300 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
      >
        📋 채점 포인트 확인
      </button>
    )
  }

  return (
    <div className="space-y-4 border border-primary-200 rounded-xl p-4 bg-primary-50/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink">채점 포인트</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary-600">{checkedCount}/{checkPoints.length}</span>
          <button onClick={() => setOpen(false)} className="text-ink-faint hover:text-ink text-xs">닫기</button>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="h-2 bg-surface-soft rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${(checkedCount / checkPoints.length) * 100}%` }}
        />
      </div>

      {/* 체크리스트 */}
      <ul className="space-y-2">
        {checkPoints.map((point, i) => (
          <li key={`cp-${i}-${point.slice(0, 20)}`} className="flex gap-2 items-start">
            <button
              onClick={() => toggle(i)}
              className={`shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                checked[i]
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-ink-faint bg-surface'
              }`}
            >
              {checked[i] && <span className="text-xs font-bold">✓</span>}
            </button>
            <span className={`text-sm leading-relaxed ${checked[i] ? 'line-through text-ink-faint' : 'text-ink'}`}>
              {point}
            </span>
          </li>
        ))}
      </ul>

      {/* 모범답안 토글 */}
      <div className="pt-2 border-t border-primary-100">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-sm text-primary-600 font-medium hover:text-primary-800 transition-colors"
        >
          {showAnswer ? '▲ 모범답안 숨기기' : '▼ 모범답안 확인'}
        </button>
        {showAnswer && (
          <div className="mt-2 p-3 bg-surface rounded-lg border border-[var(--q-border)] text-sm text-ink leading-relaxed whitespace-pre-wrap">
            {sampleAnswer}
          </div>
        )}
      </div>
    </div>
  )
}
