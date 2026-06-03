import React from 'react'

interface Props {
  title: string
  type: string
  subtype: string
  notation: string
  scenario: string
  requirements: string[]
}

const TYPE_LABELS: Record<string, string> = {
  logical_model: '논리 데이터 모델 작성',
  standard_form: '표준화 정의서 작성',
}

const SUBTYPE_LABELS: Record<string, string> = {
  type1: '유형1 — 지문 분석 → 모델 작성',
  type2: '유형2 — 현행 모델 → 목표 모델 개선',
  entity: '영역1 — 엔터티 정의',
  standard: '영역2 — 데이터 표준 정의',
}

const NOTATION_LABELS: Record<string, string> = {
  barker: '바커(Barker) 표기법',
  ie: 'IE(Information Engineering) 표기법',
}

export default function ScenarioPanel({ title, type, subtype, notation, scenario, requirements }: Props) {
  return (
    <div className="space-y-4">
      {/* 문제 헤더 */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
            {TYPE_LABELS[type] ?? type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-ink-muted border border-[var(--q-border)]">
            {SUBTYPE_LABELS[subtype] ?? subtype}
          </span>
        </div>
        <h2 className="text-base font-bold text-ink leading-snug">{title}</h2>
      </div>

      {/* 표기법 안내 */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
        <span className="text-base" role="img" aria-label="주의">⚠️</span>
        <span><strong>사용 표기법:</strong> {NOTATION_LABELS[notation] ?? notation} — 혼용 금지</span>
      </div>

      {/* 지문 */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">지문</h3>
        <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap bg-surface rounded-lg p-3 border border-[var(--q-border)]">
          {scenario}
        </div>
      </div>

      {/* 요구사항 */}
      {requirements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">요구사항</h3>
          <ul className="space-y-1.5">
            {requirements.map((req, i) => (
              <li key={`req-${i}`} className="flex gap-2 text-sm text-ink">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
