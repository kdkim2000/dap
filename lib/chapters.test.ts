import { describe, it, expect } from 'vitest'
import {
  CHAPTERS,
  PART_TITLES,
  getChapterById,
  getChapterTitle,
  getChapterIdByQuestionId,
  CHAPTER_IDS,
} from './chapters'

describe('chapters', () => {
  it('should have 21 chapters (6과목 DAP)', () => {
    expect(CHAPTERS).toHaveLength(21)
  })

  it('should have correct chapter counts per part', () => {
    expect(CHAPTERS.filter(c => c.part === 1)).toHaveLength(3)
    expect(CHAPTERS.filter(c => c.part === 2)).toHaveLength(4)
    expect(CHAPTERS.filter(c => c.part === 3)).toHaveLength(3)
    expect(CHAPTERS.filter(c => c.part === 4)).toHaveLength(4)
    expect(CHAPTERS.filter(c => c.part === 5)).toHaveLength(3)  // 5과목
    expect(CHAPTERS.filter(c => c.part === 6)).toHaveLength(4)  // 6과목
  })

  it('getChapterById returns correct chapter with official title', () => {
    const ch1 = getChapterById('part4_ch1')
    expect(ch1?.title).toBe('데이터 모델링 이해')
    expect(ch1?.part).toBe(4)

    const ch4 = getChapterById('part4_ch4')
    expect(ch4?.title).toBe('물리 데이터 모델링')
    expect(ch4?.chapter).toBe(4)

    const p2c4 = getChapterById('part2_ch4')
    expect(p2c4?.title).toBe('정보 요구 검증')
    expect(p2c4?.part).toBe(2)
  })

  it('getChapterTitle returns official title', () => {
    expect(getChapterTitle('part1_ch1')).toBe('전사아키텍처 개요')
    expect(getChapterTitle('part1_ch2')).toBe('전사아키텍처 구축')
    expect(getChapterTitle('part2_ch4')).toBe('정보 요구 검증')
    expect(getChapterTitle('part4_ch2')).toBe('개념 데이터 모델링')
    expect(getChapterTitle('part4_ch3')).toBe('논리 데이터 모델링')
  })

  it('5과목 chapters are correctly included', () => {
    const p5c1 = getChapterById('part5_ch1')
    expect(p5c1?.title).toBe('데이터베이스 설계')
    expect(p5c1?.part).toBe(5)

    const p5c3 = getChapterById('part5_ch3')
    expect(p5c3?.title).toBe('데이터베이스 성능 개선')
    expect(p5c3?.chapter).toBe(3)
  })

  it('6과목 chapters are correctly included', () => {
    const p6c1 = getChapterById('part6_ch1')
    expect(p6c1?.title).toBe('데이터 이해')
    expect(p6c1?.part).toBe(6)

    const p6c4 = getChapterById('part6_ch4')
    expect(p6c4?.title).toBe('데이터 품질 관리 관점')
    expect(p6c4?.chapter).toBe(4)
  })

  it('PART_TITLES includes all 6 subjects', () => {
    expect(PART_TITLES[5]).toBe('데이터베이스 설계와 이용')
    expect(PART_TITLES[6]).toBe('데이터 품질 관리이해')
  })

  it('getChapterIdByQuestionId works for all parts', () => {
    expect(getChapterIdByQuestionId('p4c1_001')).toBe('part4_ch1')
    expect(getChapterIdByQuestionId('p4c4_001')).toBe('part4_ch4')
    expect(getChapterIdByQuestionId('p2c4_001')).toBe('part2_ch4')
    expect(getChapterIdByQuestionId('p5c1_001')).toBe('part5_ch1')
    expect(getChapterIdByQuestionId('p6c4_001')).toBe('part6_ch4')
  })

  it('all chapter ids are unique', () => {
    expect(new Set(CHAPTER_IDS).size).toBe(CHAPTER_IDS.length)
  })

  it('all idPrefixes are unique', () => {
    const prefixes = CHAPTERS.map(c => c.idPrefix)
    expect(new Set(prefixes).size).toBe(prefixes.length)
  })
})
