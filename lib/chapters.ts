import type { ChapterMeta } from '@/types'

export interface ChapterDef extends ChapterMeta {
  idPrefix: string
}

export const CHAPTERS: ChapterDef[] = [
  // 1과목: 전사아키텍처 이해
  { id: 'part1_ch1', part: 1, chapter: 1, title: '전사아키텍처 개요',          idPrefix: 'p1c1_', questionCount: 0 },
  { id: 'part1_ch2', part: 1, chapter: 2, title: '전사아키텍처 구축',          idPrefix: 'p1c2_', questionCount: 0 },
  { id: 'part1_ch3', part: 1, chapter: 3, title: '전사아키텍처 관리 및 활용',  idPrefix: 'p1c3_', questionCount: 0 },
  // 2과목: 데이터 요건 분석
  { id: 'part2_ch1', part: 2, chapter: 1, title: '정보 요구 사항 개요',        idPrefix: 'p2c1_', questionCount: 0 },
  { id: 'part2_ch2', part: 2, chapter: 2, title: '정보 요구 사항 조사',        idPrefix: 'p2c2_', questionCount: 0 },
  { id: 'part2_ch3', part: 2, chapter: 3, title: '정보 요구 사항 분석',        idPrefix: 'p2c3_', questionCount: 0 },
  { id: 'part2_ch4', part: 2, chapter: 4, title: '정보 요구 검증',             idPrefix: 'p2c4_', questionCount: 0 },
  // 3과목: 데이터 표준화
  { id: 'part3_ch1', part: 3, chapter: 1, title: '데이터 표준화 개요',         idPrefix: 'p3c1_', questionCount: 0 },
  { id: 'part3_ch2', part: 3, chapter: 2, title: '데이터 표준 수립',           idPrefix: 'p3c2_', questionCount: 0 },
  { id: 'part3_ch3', part: 3, chapter: 3, title: '데이터 표준 관리',           idPrefix: 'p3c3_', questionCount: 0 },
  // 4과목: 데이터 모델링
  { id: 'part4_ch1', part: 4, chapter: 1, title: '데이터 모델링 이해',         idPrefix: 'p4c1_', questionCount: 0 },
  { id: 'part4_ch2', part: 4, chapter: 2, title: '개념 데이터 모델링',         idPrefix: 'p4c2_', questionCount: 0 },
  { id: 'part4_ch3', part: 4, chapter: 3, title: '논리 데이터 모델링',         idPrefix: 'p4c3_', questionCount: 0 },
  { id: 'part4_ch4', part: 4, chapter: 4, title: '물리 데이터 모델링',         idPrefix: 'p4c4_', questionCount: 0 },
]

export const CHAPTERS_BY_PART: Record<number, ChapterDef[]> = {
  1: CHAPTERS.filter(c => c.part === 1),
  2: CHAPTERS.filter(c => c.part === 2),
  3: CHAPTERS.filter(c => c.part === 3),
  4: CHAPTERS.filter(c => c.part === 4),
}

export const CHAPTER_IDS = CHAPTERS.map(c => c.id)

export const CHAPTER_BY_ID: Record<string, ChapterDef> = Object.fromEntries(
  CHAPTERS.map(c => [c.id, c])
)

export function getChapterById(id: string): ChapterDef | undefined {
  return CHAPTER_BY_ID[id]
}

export function getChapterTitle(id: string): string {
  return CHAPTER_BY_ID[id]?.title ?? id
}

export function getChapterFullLabel(id: string): string {
  const c = CHAPTER_BY_ID[id]
  if (!c) return id
  return `${c.part}과목 ${c.chapter}장 - ${c.title}`
}

export function getChapterIdByQuestionId(questionId: string): string | undefined {
  return CHAPTERS.find(c => questionId.startsWith(c.idPrefix))?.id
}

export const PART_TITLES: Record<number, string> = {
  1: '전사아키텍처 이해',
  2: '데이터 요건 분석',
  3: '데이터 표준화',
  4: '데이터 모델링',
}
