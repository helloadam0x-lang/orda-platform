'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Orda] Page error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 24, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 72, color: '#F59E0B', lineHeight: 1,
      }}>!</div>
      <h2 style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 26, fontWeight: 900, color: '#F5F5F5',
      }}>Something went wrong</h2>
      <p style={{ color: 'rgba(245,245,245,0.5)', fontSize: 15, maxWidth: 360 }}>
        Our team has been notified. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 24px', background: '#F59E0B',
          color: '#050505', borderRadius: 8,
          fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  )
}
