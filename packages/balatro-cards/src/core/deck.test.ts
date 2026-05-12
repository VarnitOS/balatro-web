import { describe, it, expect } from 'vitest'
import { createDeck, shuffleDeck, sortByRank, sortBySuit } from './deck'

describe('createDeck', () => {
  it('creates a 52-card deck by default', () => {
    const deck = createDeck()
    expect(deck).toHaveLength(52)
  })

  it('all cards face back by default', () => {
    const deck = createDeck()
    expect(deck.every(c => c.facing === 'back')).toBe(true)
  })

  it('each card has a unique id', () => {
    const deck = createDeck()
    const ids = new Set(deck.map(c => c.id))
    expect(ids.size).toBe(52)
  })

  it('respects custom ranks and suits', () => {
    const deck = createDeck({ ranks: ['A', 'B'], suits: ['x', 'y'] })
    expect(deck).toHaveLength(4)
    expect(deck.map(c => c.rank).sort()).toEqual(['A', 'A', 'B', 'B'])
  })

  it('uses fully custom cards when provided', () => {
    const custom = [{ id: 'x', rank: 'Fire', suit: '🔥', facing: 'back' as const }]
    const deck = createDeck({ cards: custom })
    expect(deck).toHaveLength(1)
    expect(deck[0].rank).toBe('Fire')
  })

  it('includes 2 jokers when jokers: true', () => {
    const deck = createDeck({ jokers: true })
    expect(deck).toHaveLength(54)
    expect(deck.filter(c => c.rank === 'Joker')).toHaveLength(2)
  })
})

describe('shuffleDeck', () => {
  it('returns same number of cards', () => {
    const deck = createDeck()
    expect(shuffleDeck(deck)).toHaveLength(52)
  })

  it('does not mutate the input array', () => {
    const deck = createDeck()
    const original = [...deck]
    shuffleDeck(deck)
    expect(deck).toEqual(original)
  })

  it('produces a different order (probabilistic)', () => {
    const deck = createDeck()
    const shuffled = shuffleDeck(deck)
    // Chance of identical order is 1/52! — effectively impossible
    expect(shuffled.map(c => c.id)).not.toEqual(deck.map(c => c.id))
  })
})

describe('sortByRank', () => {
  it('sorts 2 before A', () => {
    const deck = createDeck()
    const sorted = sortByRank(deck)
    expect(sorted[0].rank).toBe('2')
    expect(sorted[sorted.length - 1].rank).toBe('A')
  })

  it('does not mutate input', () => {
    const deck = createDeck()
    const original = [...deck]
    sortByRank(deck)
    expect(deck).toEqual(original)
  })
})

describe('sortBySuit', () => {
  it('groups cards by suit', () => {
    const deck = createDeck()
    const sorted = sortBySuit(deck)
    const suits = sorted.map(c => c.suit)
    // All spades together, all hearts together, etc.
    const groups = suits.reduce<string[]>((acc, s) => {
      if (acc[acc.length - 1] !== s) acc.push(s)
      return acc
    }, [])
    expect(groups.length).toBe(4)
  })
})
