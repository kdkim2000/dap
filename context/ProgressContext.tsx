import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import type { ProgressStore, AnswerResult, ExamResult, Stats } from '@/types'
import {
  loadProgress,
  saveProgress,
  markAnswer as libMarkAnswer,
  toggleBookmark as libToggleBookmark,
  saveExamResult as libSaveExamResult,
  resetProgress as libResetProgress,
  getStats,
} from '@/lib/progress'
import { getAllQuestionsIdMap } from '@/lib/questions'

interface ProgressContextValue {
  progress: ProgressStore
  stats: Stats
  isHydrated: boolean
  markAnswer: (id: string, result: AnswerResult) => void
  toggleBookmark: (id: string) => void
  saveExamResult: (result: ExamResult) => void
  resetProgress: () => void
  isBookmarked: (id: string) => boolean
  setLastVisited: (type: 'theory' | 'quiz' | 'practical', id: string) => void
  getStreak: () => number
  getXP: () => number
  getGems: () => number
  getHearts: () => number
}

const defaultStats: Stats = {
  total: 0, attempted: 0, correct: 0,
  byChapter: {}, byPart: {},
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressStore>({
    answers: {}, bookmarks: [], lastVisited: null, examHistory: [],
  })
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [isHydrated, setIsHydrated] = useState(false)
  const [idMap, setIdMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const loaded = loadProgress()
    const map = getAllQuestionsIdMap()
    setIdMap(map)
    setProgress(loaded)
    setStats(getStats(loaded, map))
    setIsHydrated(true)
  }, [])

  const refresh = useCallback((store: ProgressStore) => {
    setProgress(store)
    setStats(getStats(store, idMap))
  }, [idMap])

  const markAnswer = useCallback((id: string, result: AnswerResult) => {
    refresh(libMarkAnswer(id, result))
  }, [refresh])

  const toggleBookmark = useCallback((id: string) => {
    refresh(libToggleBookmark(id))
  }, [refresh])

  const saveExamResultFn = useCallback((result: ExamResult) => {
    refresh(libSaveExamResult(result))
  }, [refresh])

  const resetProgressFn = useCallback(() => {
    refresh(libResetProgress())
  }, [refresh])

  const setLastVisited = useCallback((type: 'theory' | 'quiz' | 'practical', id: string) => {
    const store = loadProgress()
    store.lastVisited = { type, id }
    saveProgress(store)
    setProgress(prev => ({ ...prev, lastVisited: { type, id } }))
  }, [])

  const isBookmarked = useCallback((id: string) => progress.bookmarks.includes(id), [progress.bookmarks])
  const getStreak = useCallback(() => progress.examHistory.length, [progress.examHistory])
  const getXP = useCallback(() => Object.values(progress.answers).filter(v => v === 'correct').length * 10, [progress.answers])
  const getGems = useCallback(() => progress.examHistory.length * 50, [progress.examHistory])
  const getHearts = useCallback(() => 3, [])

  return (
    <ProgressContext.Provider value={{
      progress, stats, isHydrated,
      markAnswer, toggleBookmark,
      saveExamResult: saveExamResultFn,
      resetProgress: resetProgressFn,
      isBookmarked, setLastVisited, getStreak, getXP, getGems, getHearts,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
