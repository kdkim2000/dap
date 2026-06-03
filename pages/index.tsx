import React from 'react'
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
