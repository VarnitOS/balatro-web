import { create } from 'zustand'
import type { BalatroCard, DeckConfig, Edition, Seal, SortBy } from './types'
import { createDeck, shuffleDeck, sortByRank, sortBySuit } from './deck'

interface DeckStore {
  deck: BalatroCard[]
  hand: BalatroCard[]
  discard: BalatroCard[]
  selected: BalatroCard[]
  config: DeckConfig

  _initialize: (config: DeckConfig) => void
  _shuffle: () => void
  _draw: (n: number) => void
  _discardCards: (cards?: BalatroCard[]) => void
  _selectCard: (card: BalatroCard) => void
  _sortHand: (by: SortBy) => void
  _setEdition: (cardId: string, edition: Edition | undefined) => void
  _setSeal: (cardId: string, seal: Seal | undefined) => void
  _reset: () => void
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  deck: [],
  hand: [],
  discard: [],
  selected: [],
  config: {},

  _initialize: (config) => {
    const cards = createDeck(config)
    set({ deck: shuffleDeck(cards), hand: [], discard: [], selected: [], config })
  },

  _shuffle: () =>
    set(state => ({ deck: shuffleDeck([...state.deck]) })),

  _draw: (n) =>
    set(state => {
      const toDraw = state.deck.slice(0, n).map(c => ({ ...c, facing: 'front' as const }))
      return { deck: state.deck.slice(n), hand: [...state.hand, ...toDraw] }
    }),

  _discardCards: (cards) =>
    set(state => {
      const toDiscard = cards ?? state.selected
      const ids = new Set(toDiscard.map(c => c.id))
      return {
        hand: state.hand.filter(c => !ids.has(c.id)),
        discard: [...state.discard, ...toDiscard],
        selected: state.selected.filter(c => !ids.has(c.id)),
      }
    }),

  _selectCard: (card) =>
    set(state => {
      const already = state.selected.some(c => c.id === card.id)
      return {
        selected: already
          ? state.selected.filter(c => c.id !== card.id)
          : [...state.selected, card],
      }
    }),

  _sortHand: (by) =>
    set(state => ({
      hand: by === 'rank' ? sortByRank(state.hand) : sortBySuit(state.hand),
    })),

  _setEdition: (cardId, edition) =>
    set(state => ({
      hand: state.hand.map(c => c.id === cardId ? { ...c, edition } : c),
    })),

  _setSeal: (cardId, seal) =>
    set(state => ({
      hand: state.hand.map(c => c.id === cardId ? { ...c, seal } : c),
    })),

  _reset: () => {
    const { config } = get()
    const cards = createDeck(config)
    set({ deck: shuffleDeck(cards), hand: [], discard: [], selected: [] })
  },
}))
