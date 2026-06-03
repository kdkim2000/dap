import React, { useEffect, useState, useRef } from 'react'

interface TOCItem {
  id: string
  text: string
  level: 2 | 3
}

interface TheoryTOCProps {
  content: string
}

function slugify(text: string): string {
  return text
    .replace(/[^\w\s가-힣]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function parseHeadings(content: string): TOCItem[] {
  const lines = content.split('\n')
  const items: TOCItem[] = []

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/)
    const h3 = line.match(/^###\s+(.+)/)

    if (h2) {
      const text = h2[1].trim()
      items.push({ id: slugify(text), text, level: 2 })
    } else if (h3) {
      const text = h3[1].trim()
      items.push({ id: slugify(text), text, level: 3 })
    }
  }

  return items
}

export default function TheoryTOC({ content }: TheoryTOCProps) {
  const items = parseHeadings(content)
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    const ids = items.map(i => i.id)

    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Pick the topmost visible heading
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-70px 0px -60% 0px', threshold: 0 }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  if (items.length === 0) return null

  return (
    <nav className="space-y-1" aria-label="목차">
      <h3 className="text-xs font-bold text-ink-faint uppercase tracking-wider mb-3 px-2">목차</h3>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-all duration-150 leading-snug ${
            item.level === 3 ? 'ml-3 text-xs' : ''
          } ${
            activeId === item.id
              ? 'bg-primary-100 text-primary-700 font-semibold'
              : 'text-ink-muted hover:text-ink hover:bg-surface-soft'
          }`}
        >
          {item.level === 3 && <span className="mr-1 text-ink-faint">└</span>}
          {item.text}
        </button>
      ))}
    </nav>
  )
}
