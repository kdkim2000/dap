import type { PracticalProblem, PracticalDraft } from '@/types'

const PRACTICAL_KEY_PREFIX = 'dap_practical_'

function loadPracticalFile(id: string): PracticalProblem {
  // eslint-disable-next-line global-require
  return require(`@/data/practical/${id}.json`) as PracticalProblem
}

function listPracticalIds(): string[] {
  // Next.js SSG 빌드 시 require.context 대신 알려진 ID 목록을 반환
  // 실기 문제가 추가될 때마다 이 목록을 갱신한다
  return [
    'prac_001',
    'prac_002',
    'prac_003',
    'prac_004',
    'prac_005',
  ]
}

export function getPracticalProblems(): PracticalProblem[] {
  return listPracticalIds().flatMap(id => {
    try {
      return [loadPracticalFile(id)]
    } catch {
      return []
    }
  })
}

export function getPracticalById(id: string): PracticalProblem | undefined {
  try {
    return loadPracticalFile(id)
  } catch {
    return undefined
  }
}

// ── 실기 답안 임시 저장 (BR-022, BR-025) ──────────────────────────────────
export function savePracticalDraft(practiceId: string, draft: PracticalDraft): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      `${PRACTICAL_KEY_PREFIX}${practiceId}`,
      JSON.stringify(draft),
    )
  } catch { /* quota exceeded – ignore */ }
}

export function loadPracticalDraft(practiceId: string): PracticalDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${PRACTICAL_KEY_PREFIX}${practiceId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // 런타임 필드 검증 (오염된 데이터 방어)
    if (typeof parsed !== 'object' || parsed === null) return null
    if (typeof parsed.textAnswer !== 'string') return null
    if (typeof parsed.savedAt !== 'number') return null
    return parsed as PracticalDraft
  } catch {
    return null
  }
}

export function clearPracticalDraft(practiceId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${PRACTICAL_KEY_PREFIX}${practiceId}`)
}
