import React from 'react'
import Link from 'next/link'

interface Props {
  variant?: 'compact' | 'extended'
  showLink?: boolean
}

export default function PracticalExamNotice({ variant = 'extended', showLink = false }: Props) {
  if (variant === 'compact') {
    return (
      <div className="text-left bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
        <div className="font-semibold text-amber-800">⚠️ 실기 40점 별도</div>
        <div className="text-amber-700 mt-1">실기 1문항 40점은 별도로 준비 필요. 실기 연습 메뉴를 활용하세요.</div>
      </div>
    )
  }

  return (
    <div className="q-card bg-amber-50 border-amber-200 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xl" role="img" aria-label="주의">⚠️</span>
        <h3 className="font-semibold text-amber-800">실기 40점 별도 준비 필요</h3>
      </div>
      <p className="text-sm text-amber-700">
        DAP 시험에서 실기 1문항은 전체 배점의 40점을 차지합니다.
        필기 만점(60점)이어도 실기 미달 시 불합격됩니다.
      </p>
      {showLink && (
        <Link
          href="/practical"
          className="inline-block mt-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          실기 연습 시작 →
        </Link>
      )}
    </div>
  )
}
