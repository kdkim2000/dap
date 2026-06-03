import React from 'react'
import { useProgress } from '@/context/ProgressContext'

export default function WeeklyXP() {
  const { getXP, getStreak, progress, isHydrated } = useProgress()

  const xp = isHydrated ? getXP() : 0
  const streak = isHydrated ? getStreak() : 0

  // Build last 7 days XP from examHistory
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토']

  const examsByDay: Record<string, number> = {}
  if (isHydrated) {
    for (const exam of progress.examHistory) {
      const day = exam.date.slice(0, 10)
      examsByDay[day] = (examsByDay[day] ?? 0) + exam.score
    }
  }

  const dayData = last7Days.map(date => ({
    date,
    label: dayLabels[new Date(date).getDay()],
    value: examsByDay[date] ?? 0,
  }))

  const maxVal = Math.max(...dayData.map(d => d.value), 1)

  const xpLevel = Math.floor(xp / 100)
  const xpProgress = xp % 100

  return (
    <div className="q-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">누적 XP</h2>
        <span className="text-xs text-ink-faint">최근 7일 활동</span>
      </div>

      {/* XP display */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-primary-600">{xp.toLocaleString()}</span>
            <span className="text-sm text-ink-muted">XP</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-ink-muted">Lv.{xpLevel}</span>
            <div className="flex-1 h-1.5 bg-surface-soft rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-xs text-ink-muted">Lv.{xpLevel + 1}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl">🔥</div>
          <div className="text-xs text-ink-muted mt-0.5">{streak}회</div>
          <div className="text-xs text-ink-faint">시험</div>
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <div className="flex items-end gap-1 h-16">
          {dayData.map(d => {
            const height = d.value > 0 ? Math.max((d.value / maxVal) * 100, 15) : 0
            const isToday = d.date === today.toISOString().slice(0, 10)
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '48px' }}>
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      d.value > 0
                        ? isToday ? 'bg-primary-600' : 'bg-primary-300'
                        : 'bg-surface-soft border border-[var(--q-border)]'
                    }`}
                    style={{ height: d.value > 0 ? `${height}%` : '4px' }}
                    title={`${d.date}: ${d.value}점`}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'text-primary-600 font-bold' : 'text-ink-faint'}`}>
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
