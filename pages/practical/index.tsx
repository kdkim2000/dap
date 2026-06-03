import React from 'react'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import type { PracticalProblem } from '@/types'
import { getPracticalProblems } from '@/lib/practical'

interface Props {
  problems: PracticalProblem[]
}

const PREVIEW_LENGTH = 80

const TYPE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  logical_model: { label: '논리 데이터 모델 작성', icon: '🗺️', desc: '지문 분석 → 엔터티·관계·속성·서브타입 정의' },
  standard_form: { label: '표준화 정의서 작성', icon: '📋', desc: '엔터티 정의 / 데이터 표준(단어·용어·코드·도메인) 정의' },
}

const NOTATION_LABELS: Record<string, string> = {
  barker: '바커(Barker)',
  ie: 'IE 표기법',
}

export default function PracticalIndexPage({ problems }: Props) {
  const logicalProblems = problems.filter(p => p.type === 'logical_model')
  const standardProblems = problems.filter(p => p.type === 'standard_form')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">실기 연습</h1>
        <p className="text-ink-muted mt-1 text-sm">
          논리 데이터 모델 작성·표준화 정의서 작성으로 실기 시험을 대비하세요.
        </p>
      </div>

      {/* 실기 유형 안내 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(TYPE_LABELS).map(([type, info]) => (
          <div key={type} className="q-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{info.icon}</span>
              <h2 className="font-bold text-ink">{info.label}</h2>
            </div>
            <p className="text-sm text-ink-muted">{info.desc}</p>
          </div>
        ))}
      </div>

      {/* 표기법 안내 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-semibold text-amber-800 flex items-center gap-2">
          <span>⚠️</span> 표기법 주의사항
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 바커(Barker) 표기법과 IE 표기법 중 <strong>하나만</strong> 일관되게 사용</li>
          <li>• 혼용 시 감점 요인이 됩니다</li>
          <li>• 관계명 필수 표기, 최소 3차 정규화(3NF) 적용</li>
        </ul>
      </div>

      {/* 논리 데이터 모델 문제 */}
      {logicalProblems.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">🗺️ 논리 데이터 모델 작성</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {logicalProblems.map(problem => (
              <Link
                key={problem.id}
                href={`/practical/${problem.id}`}
                className="q-card hover:shadow-q-md transition-all group hover:border-primary-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
                        {problem.subtype === 'type1' ? '유형1' : '유형2'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--q-border)] text-ink-muted">
                        {NOTATION_LABELS[problem.notation] ?? problem.notation}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ink text-sm group-hover:text-primary-700 transition-colors leading-snug">
                      {problem.title}
                    </h3>
                  </div>
                  <span className="text-xl shrink-0">→</span>
                </div>
                <p className="text-xs text-ink-faint line-clamp-2">
                  {problem.scenario.slice(0, PREVIEW_LENGTH)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 표준화 정의서 문제 */}
      {standardProblems.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">📋 표준화 정의서 작성</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {standardProblems.map(problem => (
              <Link
                key={problem.id}
                href={`/practical/${problem.id}`}
                className="q-card hover:shadow-q-md transition-all group hover:border-primary-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold">
                        {problem.subtype === 'entity' ? '엔터티 정의' : '데이터 표준'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ink text-sm group-hover:text-primary-700 transition-colors leading-snug">
                      {problem.title}
                    </h3>
                  </div>
                  <span className="text-xl shrink-0">→</span>
                </div>
                <p className="text-xs text-ink-faint line-clamp-2">
                  {problem.scenario.slice(0, PREVIEW_LENGTH)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {problems.length === 0 && (
        <div className="text-center text-ink-muted py-16">
          <div className="text-4xl mb-3">📭</div>
          <p>아직 실기 연습 문제가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const problems = getPracticalProblems()
  return { props: { problems } }
}
