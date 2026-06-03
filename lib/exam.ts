import type { Question, ExamResult, AnswerResult } from '@/types'

// ── 과목별 배점 상수 ────────────────────────────────────────────────────────
export const PART_MAX_SCORE: Record<number, number> = {
  1: 8, 2: 8, 3: 8, 4: 20, 5: 8, 6: 8,  // 합계 60점
}

export const PART_QUOTA: Record<number, number> = {
  1: 10, 2: 10, 3: 10, 4: 25, 5: 10, 6: 10,  // 합계 75문항
}

export const POINTS_PER_Q = 0.8

export const EXAM_SECONDS = 14400  // 240분

// ── 점수 계산 (BR-001~003) ──────────────────────────────────────────────────
export function calcPartScore(correctCount: number): number {
  return Math.round(correctCount * POINTS_PER_Q * 10) / 10
}

// ── 합격 판정 (BR-004~006) ──────────────────────────────────────────────────
export function isPartPassed(part: number, score: number): boolean {
  return score >= (PART_MAX_SCORE[part] ?? 8) * 0.4
}

export function isExamPassed(scores: Record<number, number>): boolean {
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  return total >= 36 && [1, 2, 3, 4, 5, 6].every(p => isPartPassed(p, scores[p] ?? 0))
}

// ── ExamResult 산출 ─────────────────────────────────────────────────────────
type LocalAnswer = { selectedIndex: number; result: AnswerResult }

export function computeExamResult(
  answers: Record<number, LocalAnswer>,
  questions: Question[],
  elapsed: number,
): ExamResult {
  const correctByPart: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  const totalByPart:   Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

  questions.forEach((q, i) => {
    const p = q.part
    totalByPart[p] = (totalByPart[p] ?? 0) + 1
    if (answers[i]?.result === 'correct') {
      correctByPart[p] = (correctByPart[p] ?? 0) + 1
    }
  })

  const toScore = (part: number) =>
    calcPartScore(correctByPart[part] ?? 0)

  const partScores = [1, 2, 3, 4, 5, 6].map(toScore)
  const totalScore = Math.round(partScores.reduce((a, b) => a + b, 0) * 10) / 10

  const answersMap: Record<string, number> = {}
  questions.forEach((q, i) => {
    if (answers[i] !== undefined) answersMap[q.id] = answers[i].selectedIndex
  })

  return {
    date: new Date().toISOString(),
    score: totalScore,
    part1Score: partScores[0],
    part2Score: partScores[1],
    part3Score: partScores[2],
    part4Score: partScores[3],
    part5Score: partScores[4],
    part6Score: partScores[5],
    totalTime: elapsed,
    answers: answersMap,
  }
}
