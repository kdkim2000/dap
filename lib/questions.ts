import type { Question } from '@/types'
import { CHAPTERS } from './chapters'

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
  for (let part = 1; part <= 4; part++) {
    const partChapters = CHAPTERS.filter(c => c.part === part)
    const partQuestions = partChapters.flatMap(ch => loadChapterQuestions(ch.id))
    const targetCount = part === 4 ? 20 : 10  // 4과목: 20문항, 1~3과목: 10문항
    const shuffled = [...partQuestions].sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, targetCount))
  }
  return result
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
