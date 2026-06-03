import React, { useState, useEffect, useRef } from 'react'

interface ExamTimerProps {
  totalSeconds: number
  onTimeUp: () => void
}

export default function ExamTimer({ totalSeconds, onTimeUp }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const onTimeUpRef = useRef(onTimeUp)
  const calledRef = useRef(false)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (remaining <= 0) {
      if (!calledRef.current) {
        calledRef.current = true
        onTimeUpRef.current()
      }
      return
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const isWarning = remaining <= 600 && remaining > 60  // 10분 이하
  const isDanger = remaining <= 60                       // 1분 이하

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border-2 transition-all ${
        isDanger
          ? 'bg-red-50 border-red-400 text-red-600 animate-q-pulse'
          : isWarning
          ? 'bg-orange-50 border-orange-400 text-orange-600'
          : 'bg-surface border-[var(--q-border)] text-ink'
      }`}
      role="timer"
      aria-label={`남은 시간 ${minutes}분 ${seconds}초`}
    >
      <span className="text-base">{isDanger ? '⚠️' : isWarning ? '⏱️' : '🕐'}</span>
      <span>{display}</span>
    </div>
  )
}
