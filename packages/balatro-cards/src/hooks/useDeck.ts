import { useEffect, useRef } from 'react'
import { useDeckStore } from '../core/store'
import type { BalatroCard, DeckConfig, Edition, Seal } from '../core/types'

export function useDeck(config: DeckConfig = {}) {
  const store = useDeckStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      store._initialize(config)
    }
  }, []) // intentionally empty — initialize once on mount

  return {
    deck: store.deck,
    hand: store.hand,
    discard: store.discard,
    selected: store.selected,
    config: store.config,

    shuffle: store._shuffle,
    draw: store._draw,
    discardCards: store._discardCards,
    selectCard: store._selectCard,
    sortHand: store._sortHand,
    setEdition: (card: BalatroCard, edition: Edition | undefined) =>
      store._setEdition(card.id, edition),
    setSeal: (card: BalatroCard, seal: Seal | undefined) =>
      store._setSeal(card.id, seal),
    reset: store._reset,
  }
}
