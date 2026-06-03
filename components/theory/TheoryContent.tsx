import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'

interface TheoryContentProps {
  content: string
}

function slugify(text: string): string {
  return text
    .replace(/[^\w\s가-힣]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

const components: Components = {
  h2: ({ children, ...props }) => {
    const text = String(children)
    const id = slugify(text)
    return (
      <h2 id={id} className="text-xl font-bold text-ink mt-8 mb-4 pb-2 border-b-2 border-primary-200 scroll-mt-20" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }) => {
    const text = String(children)
    const id = slugify(text)
    return (
      <h3 id={id} className="text-lg font-semibold text-ink mt-6 mb-3 scroll-mt-20" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }) => (
    <h4 className="text-base font-semibold text-ink-muted mt-4 mb-2" {...props}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-7 text-ink mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm text-ink pl-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-4 text-sm text-ink pl-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-6">{children}</li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold text-primary-800 border border-primary-200 text-xs">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border border-[var(--q-border)] text-ink">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-surface-soft">{children}</tr>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-400 pl-4 py-1 my-4 bg-primary-50 rounded-r-xl text-sm text-ink-muted italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className={`${className} text-xs`} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto mb-4 text-xs">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-primary-700">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-primary-600 underline hover:text-primary-800" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

export default function TheoryContent({ content }: TheoryContentProps) {
  return (
    <div className="prose-dasp max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
