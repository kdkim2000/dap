import React from 'react'
import Link from 'next/link'
import Mascot from '@/components/ui/Mascot'
import { useProgress } from '@/context/ProgressContext'

export default function HeroBanner() {
  const { stats, progress, isHydrated } = useProgress()

  const overallRate = stats.attempted > 0
    ? Math.round((stats.correct / stats.attempted) * 100)
    : 0

  const lastVisited = progress.lastVisited

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-primary-600 to-purple-600 text-white rounded-q-lg p-6 sm:p-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        {/* Mascot */}
        <div className="shrink-0">
          <Mascot expression="excited" size={80} className="drop-shadow-lg" />
        </div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            DAP Master
          </h1>
          <p className="text-indigo-200 text-sm mb-4">
            데이터아키텍처 전문가 자격증을 향해 함께 나아가요!
          </p>

          {isHydrated && stats.attempted > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-indigo-200 text-sm">전체 정답률</span>
                <span className="text-2xl font-bold">{overallRate}%</span>
              </div>
              <div className="w-full max-w-xs bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${overallRate}%` }}
                />
              </div>
              <div className="text-xs text-indigo-200 mt-1">
                {stats.correct} / {stats.attempted} 정답
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
            {lastVisited ? (
              <Link
                href={`/${lastVisited.type}/${lastVisited.id}`}
                className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-q-sm"
              >
                이어서 풀기 →
              </Link>
            ) : (
              <Link
                href="/quiz"
                className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-q-sm"
              >
                문제 풀기 시작
              </Link>
            )}
            <Link
              href="/theory"
              className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/30 transition-colors border border-white/30"
            >
              이론 보기
            </Link>
          </div>
        </div>

        {/* Stats chips */}
        {isHydrated && (
          <div className="shrink-0 flex sm:flex-col gap-2">
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center border border-white/20">
              <div className="text-xl font-bold">{stats.attempted}</div>
              <div className="text-xs text-indigo-200">풀이 완료</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center border border-white/20">
              <div className="text-xl font-bold">{progress.bookmarks.length}</div>
              <div className="text-xs text-indigo-200">북마크</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center border border-white/20">
              <div className="text-xl font-bold">{progress.examHistory.length}</div>
              <div className="text-xs text-indigo-200">모의고사</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
