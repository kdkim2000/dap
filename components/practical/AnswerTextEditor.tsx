import React, { useState, useEffect, useRef } from 'react'

interface Props {
  practiceId: string
  initialValue?: string
  onSave?: (text: string) => void
}

export default function AnswerTextEditor({ practiceId, initialValue = '', onSave }: Props) {
  const [text, setText] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setText(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSave?.(val)
    }, 500)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
          텍스트 서술 답안
        </label>
        <span className="text-xs text-ink-faint">{text.length}자 · 자동 저장</span>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={`엔터티·관계·속성 등을 텍스트로 기술하세요.

예시:
엔터티: 고객, 주문, 상품
관계: 고객(1)---<주문(N): 고객이 주문을 한다
속성: 고객번호(PK), 고객명, 이메일
...`}
        className="w-full min-h-[320px] p-3 text-sm text-ink bg-surface border border-[var(--q-border)] rounded-lg resize-y focus:outline-none focus:border-primary-400 leading-relaxed font-mono"
        spellCheck={false}
      />
      <p className="text-xs text-ink-faint">
        입력 후 0.5초 뒤 자동 저장됩니다. 새로고침 후에도 내용이 유지됩니다.
      </p>
    </div>
  )
}
