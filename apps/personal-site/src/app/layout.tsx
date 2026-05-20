import type { Metadata } from 'next'
import '@balatro/cards/styles'
import './globals.css'

export const metadata: Metadata = {
  title: 'Varnit Sahu',
  description: 'CS @ Waterloo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
