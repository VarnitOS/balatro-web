import type React from 'react'

// Atlas layout from game.lua:299–352 (P_CARDS table)
const SUIT_ROW: Record<string, number> = {
  hearts: 0,
  clubs: 1,
  diamonds: 2,
  spades: 3,
}

const RANK_COL: Record<string, number> = {
  '2': 0,  '3': 1,  '4': 2,  '5': 3,  '6': 4,
  '7': 5,  '8': 6,  '9': 7, '10': 8,
  'J': 9, 'Jack': 9,
  'Q': 10, 'Queen': 10,
  'K': 11, 'King': 11,
  'A': 12, 'Ace': 12,
}

const ATLAS_COLS = 13
const ATLAS_ROWS = 4

// Returns CSS properties to render a specific card from 8BitDeck.png.
// Uses percentage-based background-position — no pixel math needed.
export function getCardFaceStyle(rank: string, suit: string): React.CSSProperties {
  const col = RANK_COL[rank]
  const row = SUIT_ROW[suit.toLowerCase()]

  // If rank or suit is not in the standard set, no sprite available
  if (col === undefined || row === undefined) return {}

  return {
    backgroundImage: 'url(/textures/1x/8BitDeck.png)',
    backgroundSize: `${ATLAS_COLS * 100}% ${ATLAS_ROWS * 100}%`,
    backgroundPosition: `${(col / (ATLAS_COLS - 1)) * 100}% ${(row / (ATLAS_ROWS - 1)) * 100}%`,
    imageRendering: 'pixelated',
  }
}

// Returns true if this rank/suit pair has a sprite in the standard atlas
export function hasSprite(rank: string, suit: string): boolean {
  return RANK_COL[rank] !== undefined && SUIT_ROW[suit.toLowerCase()] !== undefined
}

// Card back sprite: uses Enhancers.png at position {x=2, y=0} for the red deck back
// Enhancers atlas is a grid — back is at col=2, row=0
export function getCardBackStyle(): React.CSSProperties {
  return {
    backgroundImage: 'url(/textures/1x/Enhancers.png)',
    backgroundSize: '500% 800%',    // Enhancers.png is 5 cols × 8 rows
    backgroundPosition: '50% 0%',  // col 2 of 5 = 50%; row 0 of 8 = 0%
    imageRendering: 'pixelated',
  }
}
