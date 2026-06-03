import React from 'react'

interface Props {
  left: React.ReactNode
  right: React.ReactNode
}

export default function PracticalLayout({ left, right }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-4rem)]">
      {/* 지문 패널 (좌 40%) */}
      <aside
        aria-label="문제 지문"
        className="lg:w-[40%] border-b lg:border-b-0 lg:border-r border-[var(--q-border)] bg-surface-soft overflow-y-auto"
      >
        <div className="p-4 lg:p-6">{left}</div>
      </aside>
      {/* 답안 패널 (우 60%) */}
      <main aria-label="답안 작성" className="lg:w-[60%] overflow-y-auto">
        <div className="p-4 lg:p-6">{right}</div>
      </main>
    </div>
  )
}
