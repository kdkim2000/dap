import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadProgress, saveProgress, markAnswer, toggleBookmark, resetProgress, getStats } from './progress'
import type { ProgressStore } from '@/types'

const mockStorage: Record<string, string> = {}

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => mockStorage[k] ?? null,
    setItem: (k: string, v: string) => { mockStorage[k] = v },
    removeItem: (k: string) => { delete mockStorage[k] },
  })
})

describe('progress', () => {
  it('loadProgress returns default when empty', () => {
    const p = loadProgress()
    expect(p.answers).toEqual({})
    expect(p.bookmarks).toEqual([])
    expect(p.examHistory).toEqual([])
  })

  it('markAnswer stores result', () => {
    markAnswer('p4c1_001', 'correct')
    const p = loadProgress()
    expect(p.answers['p4c1_001']).toBe('correct')
  })

  it('toggleBookmark adds and removes', () => {
    toggleBookmark('p4c1_001')
    expect(loadProgress().bookmarks).toContain('p4c1_001')
    toggleBookmark('p4c1_001')
    expect(loadProgress().bookmarks).not.toContain('p4c1_001')
  })

  it('resetProgress clears all', () => {
    markAnswer('p1c1_001', 'wrong')
    toggleBookmark('p1c1_001')
    resetProgress()
    const p = loadProgress()
    expect(p.answers).toEqual({})
    expect(p.bookmarks).toEqual([])
  })

  it('getStats computes correctly', () => {
    const store: ProgressStore = {
      answers: { 'p4c1_001': 'correct', 'p4c1_002': 'wrong' },
      bookmarks: [],
      lastVisited: null,
      examHistory: [],
    }
    const idMap = { 'p4c1_001': 'part4_ch1', 'p4c1_002': 'part4_ch1' }
    const stats = getStats(store, idMap)
    expect(stats.byChapter['part4_ch1'].correct).toBe(1)
    expect(stats.byChapter['part4_ch1'].attempted).toBe(2)
    expect(stats.byPart[4].correct).toBe(1)
  })
})
