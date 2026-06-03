import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import { useProgress } from '@/context/ProgressContext'
import Badge from '@/components/ui/Badge'
import Mascot from '@/components/ui/Mascot'

export default function TopBar() {
  const router = useRouter()
  // const { getStreak, getGems, getHearts, getXP, isHydrated } = useProgress()
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('q-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.dataset.theme = 'dark'
    }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    localStorage.setItem('q-theme', next ? 'dark' : 'light')
  }

  const navLinks = [
    { href: '/',          label: '홈' },
    { href: '/theory',    label: '이론' },
    { href: '/quiz',      label: '문제풀기' },
    { href: '/practical', label: '실기 연습' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-[var(--q-border)] shadow-q-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-primary-600 text-lg shrink-0">
          <Mascot size={32} expression="happy" />
          <span className="hidden sm:block">DAP Master</span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = router.pathname === href || (href !== '/' && router.pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary-100 text-primary-700' : 'text-ink-muted hover:text-ink hover:bg-surface-soft'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right: badges + dark mode */}
        <div className="flex items-center gap-2">
          {/* Placeholder for badges when ProgressContext is ready */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge type="streak" value={0} size="sm" />
            <Badge type="gems" value={0} size="sm" />
            <Badge type="xp" value={0} size="sm" />
          </div>
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
            aria-label="다크모드 토글"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-soft"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--q-border)] bg-surface px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-soft"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
