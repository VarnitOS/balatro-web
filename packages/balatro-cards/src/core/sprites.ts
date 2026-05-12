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

// Enhancers.png atlas: 497×475 px, 7 cols × 5 rows (each sprite is 71×95 px)
const ENH_COLS = 7
const ENH_ROWS = 5

// Card back sprite: uses Enhancers.png at position col=2, row=0 (red deck back)
export function getCardBackStyle(): React.CSSProperties {
  return {
    backgroundImage: 'url(/textures/1x/Enhancers.png)',
    backgroundSize: `${ENH_COLS * 100}% ${ENH_ROWS * 100}%`,  // 700% 500%
    backgroundPosition: `${(2 / (ENH_COLS - 1)) * 100}% 0%`,  // col 2 of 7
    imageRendering: 'pixelated',
  }
}
