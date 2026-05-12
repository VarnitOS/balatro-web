import type { BalatroCard, DeckConfig } from './types'

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const DEFAULT_RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const DEFAULT_SUITS = ['spades','hearts','clubs','diamonds']
const RANK_ORDER = Object.fromEntries(DEFAULT_RANKS.map((r, i) => [r, i]))
const SUIT_ORDER: Record<string, number> = {
  spades: 0, hearts: 1, clubs: 2, diamonds: 3,
}

export function createDeck(config: DeckConfig = {}): BalatroCard[] {
  if (config.cards) {
    return config.cards.map(c => ({ ...c, facing: 'back' as const }))
  }

  const ranks = config.ranks ?? DEFAULT_RANKS
  const suits = config.suits ?? DEFAULT_SUITS
  const cards: BalatroCard[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({
        id: `${rank}-${suit}-${uid()}`,
        rank,
        suit,
        facing: 'back',
      })
    }
  }

  if (config.jokers) {
    cards.push({ id: `joker-1-${uid()}`, rank: 'Joker', suit: 'none', facing: 'back' })
    cards.push({ id: `joker-2-${uid()}`, rank: 'Joker', suit: 'none', facing: 'back' })
  }

  return cards
}

export function shuffleDeck(cards: BalatroCard[]): BalatroCard[] {
  const result = [...cards]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function sortByRank(cards: BalatroCard[]): BalatroCard[] {
  return [...cards].sort((a, b) => {
    const ar = RANK_ORDER[a.rank] ?? 999
    const br = RANK_ORDER[b.rank] ?? 999
    return ar - br
  })
}

export function sortBySuit(cards: BalatroCard[]): BalatroCard[] {
  return [...cards].sort((a, b) => {
    const as = SUIT_ORDER[a.suit] ?? 999
    const bs = SUIT_ORDER[b.suit] ?? 999
    if (as !== bs) return as - bs
    return (RANK_ORDER[a.rank] ?? 999) - (RANK_ORDER[b.rank] ?? 999)
  })
}
