import type { Question } from '@/types'
import { CHAPTERS } from './chapters'

// 과목별 모의고사 문항 수 (합계 75)
const PART_QUOTA: Record<number, number> = {
  1: 10, 2: 10, 3: 10, 4: 25, 5: 10, 6: 10,
}

function loadChapterQuestions(chapterId: string): Question[] {
  try {
    // eslint-disable-next-line global-require
    return require(`@/data/questions/${chapterId}.json`) as Question[]
  } catch {
    return []
  }
}

function loadMockExamQuestions(examNum: 1 | 2): Question[] {
  try {
    // eslint-disable-next-line global-require
    return require(`@/data/questions/mockexam/exam${examNum}.json`) as Question[]
  } catch {
    return []
  }
}

export function getAllQuestions(): Question[] {
  return CHAPTERS.flatMap(ch => loadChapterQuestions(ch.id))
}

export function getQuestionsByChapter(chapterId: string): Question[] {
  return loadChapterQuestions(chapterId)
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const all = getAllQuestions()
  const map = new Map(all.map(q => [q.id, q]))
  return ids.flatMap(id => {
    const q = map.get(id)
    return q ? [q] : []
  })
}

export function sampleExamQuestions(): Question[] {
  const result: Question[] = []
  for (let part = 1; part <= 6; part++) {
    const quota = PART_QUOTA[part] ?? 10
    const partChapters = CHAPTERS.filter(c => c.part === part)
    const partQuestions = partChapters.flatMap(ch => loadChapterQuestions(ch.id))
    const shuffled = [...partQuestions].sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, quota))
  }
  return result  // 총 75문항
}

export function getMockExamQuestions(examNum: 1 | 2): Question[] {
  return loadMockExamQuestions(examNum)
}

export function getAllQuestionsIdMap(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const ch of CHAPTERS) {
    for (const q of loadChapterQuestions(ch.id)) {
      map[q.id] = ch.id
    }
  }
  return map
}
