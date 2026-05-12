import type { Metadata } from 'next'
import '@balatro/cards/styles'

export const metadata: Metadata = {
  title: 'Balatro Cards',
  description: 'Balatro card library demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0d2e1a', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
