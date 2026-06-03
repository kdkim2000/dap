import React, { ReactNode } from 'react'
import TopBar from './TopBar'

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--q-bg)' }}>
      <TopBar />
      <main className="pt-16">{children}</main>
    </div>
  )
}
