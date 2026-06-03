import { describe, it, expect } from 'vitest'
import { CHAPTERS, getChapterById, getChapterTitle, getChapterIdByQuestionId, CHAPTER_IDS } from './chapters'

describe('chapters', () => {
  it('should have 14 chapters', () => {
    expect(CHAPTERS).toHaveLength(14)
  })

  it('should have correct chapter counts per part', () => {
    expect(CHAPTERS.filter(c => c.part === 1)).toHaveLength(3)
    expect(CHAPTERS.filter(c => c.part === 2)).toHaveLength(4)
    expect(CHAPTERS.filter(c => c.part === 3)).toHaveLength(3)
    expect(CHAPTERS.filter(c => c.part === 4)).toHaveLength(4)
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

  it('getChapterIdByQuestionId works for ch4 prefixes', () => {
    expect(getChapterIdByQuestionId('p4c1_001')).toBe('part4_ch1')
    expect(getChapterIdByQuestionId('p4c4_001')).toBe('part4_ch4')
    expect(getChapterIdByQuestionId('p2c4_001')).toBe('part2_ch4')
  })

  it('part5 chapters are not included', () => {
    expect(getChapterById('part5_ch1')).toBeUndefined()
    expect(getChapterById('part5_ch2')).toBeUndefined()
    expect(getChapterById('part5_ch3')).toBeUndefined()
  })

  it('all chapter ids are unique', () => {
    expect(new Set(CHAPTER_IDS).size).toBe(CHAPTER_IDS.length)
  })

  it('all idPrefixes are unique', () => {
    const prefixes = CHAPTERS.map(c => c.idPrefix)
    expect(new Set(prefixes).size).toBe(prefixes.length)
  })
})
