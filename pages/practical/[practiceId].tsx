import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import type { PracticalProblem, PracticalDraft } from '@/types'
import { getPracticalProblems, getPracticalById, savePracticalDraft, loadPracticalDraft } from '@/lib/practical'
import { useProgress } from '@/context/ProgressContext'
import PracticalLayout from '@/components/practical/PracticalLayout'
import ScenarioPanel from '@/components/practical/ScenarioPanel'
import AnswerTextEditor from '@/components/practical/AnswerTextEditor'
import ModelImageUpload from '@/components/practical/ModelImageUpload'
import ScoringGuide from '@/components/practical/ScoringGuide'

interface Props {
  problem: PracticalProblem
}

type AnswerTab = 'text' | 'image'

export default function PracticalProblemPage({ problem }: Props) {
  const { setLastVisited } = useProgress()

  useEffect(() => { setLastVisited('practical', problem.id) }, [problem.id, setLastVisited])

  const [tab, setTab] = useState<AnswerTab>('text')
  const [draft, setDraft] = useState<PracticalDraft>({ textAnswer: '', imageDataUrl: null, savedAt: 0 })
  const draftRef = useRef(draft)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  // 기존 답안 복원
  useEffect(() => {
    const saved = loadPracticalDraft(problem.id)
    if (saved) {
      setDraft(saved)
      draftRef.current = saved
      if (saved.savedAt > 0) setSavedAt(new Date(saved.savedAt))
    }
  }, [problem.id])

  // draftRef로 최신 draft를 추적하여 handleTextSave·handleImageSave 재생성 방지
  useEffect(() => { draftRef.current = draft }, [draft])

  const handleTextSave = useCallback((text: string) => {
    const next: PracticalDraft = { ...draftRef.current, textAnswer: text, savedAt: Date.now() }
    setDraft(next)
    savePracticalDraft(problem.id, next)
    setSavedAt(new Date())
  }, [problem.id])

  const handleImageSave = useCallback((dataUrl: string | null) => {
    const next: PracticalDraft = { ...draftRef.current, imageDataUrl: dataUrl, savedAt: Date.now() }
    setDraft(next)
    savePracticalDraft(problem.id, next)
    setSavedAt(new Date())
  }, [problem.id])

  const leftPanel = (
    <ScenarioPanel
      title={problem.title}
      type={problem.type}
      subtype={problem.subtype}
      notation={problem.notation}
      scenario={problem.scenario}
      requirements={problem.requirements}
    />
  )

  const rightPanel = (
    <div className="space-y-5">
      {/* 탭 */}
      <div role="tablist" aria-label="답안 작성 방식" className="flex gap-1 bg-surface-soft rounded-lg p-1">
        <button
          role="tab"
          aria-selected={tab === 'text'}
          aria-controls="panel-text"
          onClick={() => setTab('text')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            tab === 'text'
              ? 'bg-surface text-primary-700 shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          📝 텍스트 서술
        </button>
        <button
          role="tab"
          aria-selected={tab === 'image'}
          aria-controls="panel-image"
          onClick={() => setTab('image')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            tab === 'image'
              ? 'bg-surface text-primary-700 shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          📷 모델 이미지
        </button>
      </div>

      {/* 답안 영역 */}
      <div id="panel-text" role="tabpanel" aria-label="텍스트 서술 답안" hidden={tab !== 'text'}>
        {tab === 'text' && (
          <AnswerTextEditor
            practiceId={problem.id}
            initialValue={draft.textAnswer}
            onSave={handleTextSave}
          />
        )}
      </div>
      <div id="panel-image" role="tabpanel" aria-label="모델 이미지 업로드" hidden={tab !== 'image'}>
        {tab === 'image' && (
          <ModelImageUpload
            practiceId={problem.id}
            initialImageUrl={draft.imageDataUrl}
            onSave={handleImageSave}
          />
        )}
      </div>

      {/* 저장 시각 */}
      {savedAt && (
        <p className="text-xs text-ink-faint text-right">
          마지막 저장: {savedAt.toLocaleTimeString('ko-KR')}
        </p>
      )}

      {/* 채점 포인트 */}
      <ScoringGuide checkPoints={problem.checkPoints} sampleAnswer={problem.sampleAnswer} />
    </div>
  )

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--q-border)] bg-surface">
        <Link href="/practical" className="text-sm text-ink-muted hover:text-ink transition-colors">
          ← 실기 연습 목록
        </Link>
        <div className="text-xs text-ink-faint">
          {problem.type === 'logical_model' ? '논리 데이터 모델 작성' : '표준화 정의서 작성'}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden">
        <PracticalLayout left={leftPanel} right={rightPanel} />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const problems = getPracticalProblems()
  return {
    paths: problems.map(p => ({ params: { practiceId: p.id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const practiceId = params?.practiceId as string
  const problem = getPracticalById(practiceId)
  if (!problem) return { notFound: true }
  return { props: { problem } }
}
