import type { ProgressStore, AnswerResult, ExamResult, ExamSession, Stats } from '@/types'
import { CHAPTERS } from './chapters'

const STORAGE_KEY     = 'dap_progress'
const OLD_STORAGE_KEY = 'dasp_progress'
const EXAM_SESSION_KEY = 'dap_exam_session'

function cloneDefault(): ProgressStore {
  return {
    answers: {},
    bookmarks: [],
    lastVisited: null,
    examHistory: [],
  }
}

// dasp_progress → dap_progress 자동 마이그레이션 (BR-019)
function migrateIfNeeded(): void {
  if (typeof window === 'undefined') return
  const old = localStorage.getItem(OLD_STORAGE_KEY)
  const cur = localStorage.getItem(STORAGE_KEY)
  if (old && !cur) {
    localStorage.setItem(STORAGE_KEY, old)
    // 구 키는 삭제하지 않음 (롤백 보험)
  }
}

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return cloneDefault()
  migrateIfNeeded()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneDefault()
    return { ...cloneDefault(), ...JSON.parse(raw) }
  } catch {
    return cloneDefault()
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function markAnswer(id: string, result: AnswerResult): ProgressStore {
  const store = loadProgress()
  store.answers[id] = result
  saveProgress(store)
  return store
}

export function toggleBookmark(id: string): ProgressStore {
  const store = loadProgress()
  const idx = store.bookmarks.indexOf(id)
  if (idx >= 0) store.bookmarks.splice(idx, 1)
  else store.bookmarks.push(id)
  saveProgress(store)
  return store
}

export function saveExamResult(result: ExamResult): ProgressStore {
  const store = loadProgress()
  store.examHistory = [result, ...store.examHistory].slice(0, 10)
  saveProgress(store)
  return store
}

export function resetProgress(): ProgressStore {
  const fresh = cloneDefault()
  saveProgress(fresh)
  return fresh
}

// ── Exam session persistence ──────────────────────────────────────────────
export function saveExamSession(session: ExamSession): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(session))
  } catch { /* quota exceeded – ignore */ }
}

export function loadExamSession(): ExamSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(EXAM_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ExamSession
  } catch {
    return null
  }
}

export function clearExamSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(EXAM_SESSION_KEY)
}

// ── Stats ─────────────────────────────────────────────────────────────────
export function getStats(store: ProgressStore, allQuestionIds: Record<string, string>): Stats {
  const byChapter: Stats['byChapter'] = {}
  const byPart: Stats['byPart'] = {}

  for (const ch of CHAPTERS) {
    byChapter[ch.id] = { total: 0, correct: 0, attempted: 0 }
    byPart[ch.part] = byPart[ch.part] ?? { total: 0, correct: 0, attempted: 0 }
  }

  for (const [qid, chapterId] of Object.entries(allQuestionIds)) {
    const ch = byChapter[chapterId]
    const chDef = CHAPTERS.find(c => c.id === chapterId)
    if (!ch || !chDef) continue
    ch.total++
    byPart[chDef.part].total++
    const result = store.answers[qid]
    if (result) {
      ch.attempted++
      byPart[chDef.part].attempted++
      if (result === 'correct') {
        ch.correct++
        byPart[chDef.part].correct++
      }
    }
  }

  const total = Object.values(byChapter).reduce((s, v) => s + v.total, 0)
  const attempted = Object.values(byChapter).reduce((s, v) => s + v.attempted, 0)
  const correct = Object.values(byChapter).reduce((s, v) => s + v.correct, 0)

  return { total, attempted, correct, byChapter, byPart }
}
