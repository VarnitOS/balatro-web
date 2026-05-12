import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balatro Cards',
  description: 'Balatro card library demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#1a1a2e', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
