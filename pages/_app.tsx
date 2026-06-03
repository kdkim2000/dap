import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import Layout from '@/components/layout/Layout'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ProgressProvider } from '@/context/ProgressContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProgressProvider>
    </ErrorBoundary>
  )
}
