import React, { useEffect } from 'react'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { CHAPTER_IDS, getChapterById, PART_TITLES } from '@/lib/chapters'
import { getChapterContent, getChapterMeta } from '@/lib/theory'
import TheoryContent from '@/components/theory/TheoryContent'
import TheoryTOC from '@/components/theory/TheoryTOC'
import RelatedQuestions from '@/components/theory/RelatedQuestions'
import type { ChapterMeta } from '@/types'
import { useProgress } from '@/context/ProgressContext'

interface Props {
  chapterId: string
  content: string
  meta: ChapterMeta
  prevChapter: ChapterMeta | null
  nextChapter: ChapterMeta | null
}

export default function TheoryChapterPage({ chapterId, content, meta, prevChapter, nextChapter }: Props) {
  const { setLastVisited } = useProgress()
  useEffect(() => { setLastVisited('theory', chapterId) }, [chapterId, setLastVisited])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink-muted mb-6">
        <Link href="/theory" className="hover:text-primary-600 transition-colors">이론</Link>
        <span>›</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
          {meta.part}과목 {meta.chapter}장
        </span>
        <span className="text-ink font-medium">{meta.title}</span>
      </div>

      {/* 3-column layout */}
      <div className="flex gap-6">
        {/* Left: TOC (sticky) */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 q-card">
            <TheoryTOC content={content} />
          </div>
        </aside>

        {/* Center: Content */}
        <main className="flex-1 min-w-0">
          {/* Chapter title */}
          <div className="q-card mb-6">
            <div className="text-xs text-ink-faint mb-1">
              {PART_TITLES[meta.part]} · {meta.part}과목 {meta.chapter}장
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">{meta.title}</h1>
          </div>

          {/* Theory content */}
          <div className="q-card">
            <TheoryContent content={content} />
          </div>

          {/* Prev / Next nav */}
          <div className="flex justify-between mt-6 gap-4">
            {prevChapter ? (
              <Link
                href={`/theory/${prevChapter.id}`}
                className="flex-1 q-card hover:shadow-q-md transition-all group max-w-xs"
              >
                <div className="text-xs text-ink-faint mb-1">← 이전</div>
                <div className="text-sm font-semibold text-ink group-hover:text-primary-700 transition-colors">
                  {prevChapter.title}
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextChapter ? (
              <Link
                href={`/theory/${nextChapter.id}`}
                className="flex-1 q-card hover:shadow-q-md transition-all group max-w-xs text-right"
              >
                <div className="text-xs text-ink-faint mb-1">다음 →</div>
                <div className="text-sm font-semibold text-ink group-hover:text-primary-700 transition-colors">
                  {nextChapter.title}
                </div>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </main>

        {/* Right: Related questions (sticky) */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20 q-card">
            <RelatedQuestions chapterId={chapterId} />
          </div>
        </aside>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: CHAPTER_IDS.map(id => ({ params: { chapterId: id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chapterId = params?.chapterId as string
  const content = getChapterContent(chapterId)
  const meta = getChapterMeta(chapterId)

  if (!meta) {
    return { notFound: true }
  }

  // Determine prev/next chapters
  const idx = CHAPTER_IDS.indexOf(chapterId)
  const prevId = idx > 0 ? CHAPTER_IDS[idx - 1] : null
  const nextId = idx < CHAPTER_IDS.length - 1 ? CHAPTER_IDS[idx + 1] : null

  const prevChapter = prevId ? (getChapterMeta(prevId) ?? null) : null
  const nextChapter = nextId ? (getChapterMeta(nextId) ?? null) : null

  return {
    props: {
      chapterId,
      content,
      meta,
      prevChapter: prevChapter ?? null,
      nextChapter: nextChapter ?? null,
    },
  }
}
