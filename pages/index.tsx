import React from 'react'
import Link from 'next/link'
import HeroBanner from '@/components/dashboard/HeroBanner'
import LearningPath from '@/components/dashboard/LearningPath'
import ChapterProgress from '@/components/dashboard/ChapterProgress'
import WeakChapters from '@/components/dashboard/WeakChapters'
import WeeklyXP from '@/components/dashboard/WeeklyXP'
import ProgressChart from '@/components/dashboard/ProgressChart'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Hero banner — full width */}
      <HeroBanner />

      {/* Learning path */}
      <LearningPath />

      {/* 실기 연습 CTA */}
      <div className="q-card bg-gradient-to-r from-primary-50 to-teal-50 border-primary-200 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="실기">🗺️</span>
              <h2 className="font-bold text-ink text-base">실기 연습</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">DAP 40점</span>
            </div>
            <p className="text-sm text-ink-muted">
              논리 데이터 모델 작성·표준화 정의서 작성으로 실기를 준비하세요.
              실기 1문항이 전체 배점의 40%를 차지합니다.
            </p>
          </div>
          <Link
            href="/practical"
            className="shrink-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            연습 시작 →
          </Link>
        </div>
      </div>

      {/* 2-column: Chapter progress + Weak chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChapterProgress />
        <WeakChapters />
      </div>

      {/* 2-column: XP + Progress chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyXP />
        <ProgressChart />
      </div>
    </div>
  )
}
