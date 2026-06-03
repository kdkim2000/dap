import fs from 'fs'
import path from 'path'
import type { ChapterMeta } from '@/types'
import { CHAPTERS } from './chapters'

const THEORY_DIR = path.join(process.cwd(), 'data', 'theory')

export function getAllChapters(): ChapterMeta[] {
  return CHAPTERS.map(c => ({ ...c }))
}

export function getChapterMeta(id: string): ChapterMeta | undefined {
  return CHAPTERS.find(c => c.id === id)
}

export function getChapterContent(id: string): string {
  const filePath = path.join(THEORY_DIR, `${id}.md`)
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return `# 콘텐츠 준비 중\n\n${id} 챕터의 이론 내용이 곧 추가됩니다.`
  }
}
