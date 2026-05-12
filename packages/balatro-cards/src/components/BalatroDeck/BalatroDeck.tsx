'use client'
import { useEffect } from 'react'
import type { DeckConfig } from '../../core/types'
import { preloadSounds, type SoundName } from '../../hooks/useSound'

const PRELOAD_SOUNDS: SoundName[] = [
  'card1', 'card3', 'cardFan2', 'cardSlide1', 'cardSlide2',
  'highlight1', 'highlight2', 'chips1', 'chips2',
  'coin1', 'coin2', 'crumple1', 'crumple2',
]

const BALATRO_CSS_VARS = `
  :root {
    --balatro-bg:          #1a1a2e;
    --balatro-surface:     #252545;
    --balatro-border:      rgba(255, 255, 255, 0.08);
    --balatro-text:        #e8e8f0;
    --balatro-red:         #cc3333;
    --balatro-yellow:      #f4d03f;
    --balatro-purple:      #8b5cf6;
    --balatro-glow:        rgba(244, 208, 63, 0.5);
    --card-w:              71px;
    --card-h:              95px;
    --card-radius:         5px;
  }

  @font-face {
    font-family: 'm6x11plus';
    src: url('/fonts/m6x11plus.ttf') format('truetype');
    font-display: swap;
  }
`

interface BalatroDeckProps {
  config?: DeckConfig
  sounds?: boolean
  children: React.ReactNode
  className?: string
}

export function BalatroDeck({
  sounds = true,
  children,
  className = '',
}: BalatroDeckProps) {
  useEffect(() => {
    const existing = document.getElementById('balatro-styles')
    if (existing) return
    const style = document.createElement('style')
    style.id = 'balatro-styles'
    style.textContent = BALATRO_CSS_VARS
    document.head.appendChild(style)
    return () => { document.getElementById('balatro-styles')?.remove() }
  }, [])

  useEffect(() => {
    if (sounds) preloadSounds(PRELOAD_SOUNDS)
  }, [sounds])

  return (
    <div
      className={className}
      style={{ fontFamily: "'m6x11plus', monospace", color: 'var(--balatro-text)' }}
    >
      {children}
    </div>
  )
}
