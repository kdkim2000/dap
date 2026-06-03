import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getQuestionsByChapter } from '@/lib/questions'
import type { Question } from '@/types'

interface RelatedQuestionsProps {
  chapterId: string
}

export default function RelatedQuestions({ chapterId }: RelatedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    // getQuestionsByChapter uses require() which is fine on client for small data
    const qs = getQuestionsByChapter(chapterId)
    setQuestions(qs.slice(0, 3))
  }, [chapterId])

  if (questions.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-ink-faint uppercase tracking-wider mb-3 px-2">관련 문제</h3>
        <div className="text-xs text-ink-faint px-2">문제가 아직 준비되지 않았습니다.</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-ink-faint uppercase tracking-wider mb-3 px-2">관련 문제</h3>

      {questions.map((q, i) => (
        <div key={q.id} className="p-3 rounded-xl border border-[var(--q-border)] bg-surface-soft text-xs space-y-1 hover:border-primary-200 transition-colors">
          <div className="flex items-center gap-1 text-ink-faint mb-1">
            <span>Q{i + 1}</span>
            {q.difficulty && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                q.difficulty === '상' ? 'bg-red-50 text-red-600' :
                q.difficulty === '중' ? 'bg-yellow-50 text-yellow-600' :
                'bg-green-50 text-green-600'
              }`}>
                {q.difficulty}
              </span>
            )}
          </div>
          <p className="text-ink line-clamp-2 leading-relaxed">
            {q.content.replace(/```[\s\S]*?```/g, '[코드]').replace(/#{1,6}\s/g, '').slice(0, 60)}...
          </p>
        </div>
      ))}

      <Link
        href={`/quiz/chapter/${chapterId}`}
        className="block w-full text-center py-2 mt-3 bg-primary-600 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-colors"
      >
        전체 문제 풀기 →
      </Link>
    </div>
  )
}
